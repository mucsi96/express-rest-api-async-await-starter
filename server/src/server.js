import express from 'express'
import routes from './routes'

const app = express()

app.use(routes)

app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({'error': err.message})
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
