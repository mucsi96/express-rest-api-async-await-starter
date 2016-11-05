export async function get (req, res) {
  const result = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Hello')
    }, 500)
  })
  res.send(result)
}
