import http from 'http'
import https from 'https'
import redirectHttps from 'redirect-https'
import express from 'express'
import bodyParser from 'body-parser'
import {lexMiddleware, httpsOptions, httpsHost} from './lex'
import routes from './routes'
import {connectDB, manageDBIndexes, closeDBconnection} from './models'
import logger from './logger'
import {getEnvProp} from './env'

const app = express()
let shuttingDown = false
let httpServer, httpsServer

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
  const httpPort = getEnvProp('SERVER_HTTP_PORT')
  const httpServerLocation = httpsHost ? `http://${httpsHost}:${httpPort}` : httpPort
  const httpsPort = getEnvProp('SERVER_HTTPS_PORT')
  const httpsServerLocation = httpsHost ? `https://${httpsHost}:${httpsPort}` : httpsPort
  await new Promise((resolve) => {
    httpServer = http.createServer(lexMiddleware(redirectHttps({port: httpsPort}))).listen(httpPort, resolve)
  })
  logger.log(`Listening for ACME http-01 challenges on ${httpServerLocation}`)
  await new Promise((resolve) => {
    httpsServer = https.createServer(httpsOptions, lexMiddleware(app)).listen(httpsPort, resolve)
  })
  logger.log(`Listening for ACME tls-sni-01 challenges and serve app on ${httpsServerLocation}`)
}

// graceful shutdown
export async function stopServer (exit) {
  shuttingDown = true
  const winner = await Promise.race([
    Promise.all([
      new Promise((resolve) => httpServer ? httpServer.close(resolve) : resolve()),
      new Promise((resolve) => httpsServer ? httpsServer.close(resolve) : resolve()),
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
