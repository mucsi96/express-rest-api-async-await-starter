import express from 'express'

const app = express()
const wrap = fn => (...args) => fn(...args).catch(args[2])

app.get('/', wrap(async (req, res) => {
  const result = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Hello')
    }, 500)
  })
  res.send(result)
}))

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})
