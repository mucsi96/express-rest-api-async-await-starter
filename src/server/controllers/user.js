import {createUser} from '../models/user'

export async function create (req, res, next) {
  const {username, password} = req.body

  await createUser(username, password)
  res.status(201)
  next()
}
