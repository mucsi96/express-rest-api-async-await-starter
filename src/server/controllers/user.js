import {createUser, findUserById} from '../models/user'

export async function create (req, res, next) {
  const {username, password} = req.body

  await createUser(username, password)
  res.status(201)
  next()
}

export async function get (req, res) {
  const {id} = req.user

  const user = await findUserById(id)
  res.send({
    user: {
      id,
      username: user.username
    }
  })
}
