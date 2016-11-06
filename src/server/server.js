import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv-safe'
import routes from './routes'
import {connectDB, manageDBIndexes, closeDBconnection} from './models'
import logger from './logger'

dotenv.load()

const PORT = process.env.PORT
const app = express()
let shuttingDown = false
let server

// graceful shutdown handler
app.use((req, resp, next) => {
  if (!shuttingDown) return next()

  resp.setHeader('Connection', 'close')
  const err = new Error('Server is in the process of restarting')
  err.status = 503
  next(err)
})

app.use(bodyParser.json())

app.use(routes)

// not found handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({'error': err.message})
  if (app.get('env') === 'development') {
    logger.error(err)
  }
})

export async function startServer () {
  await connectDB()
  await manageDBIndexes()
  await new Promise((resolve) => {
    server = app.listen(PORT, resolve)
  })
  logger.log(`Example app listening on port ${PORT}!`)
}

// graceful shutdown
export async function stopServer (exit) {
  shuttingDown = true
  const winner = await Promise.race([
    Promise.all([
      new Promise((resolve) => server ? server.close(resolve) : resolve()),
      closeDBconnection()
    ]),
    new Promise((resolve) => setTimeout(resolve, 30 * 1000, 'timeout'))
  ])

  if (winner !== 'timeout') {
    logger.log('Closed out remaining connections.')
    if (exit) process.exit()
    return
  }

  logger.error('Could not close connections in time, forcing shut down')
  if (exit) process.exit(1)
}

export default app
