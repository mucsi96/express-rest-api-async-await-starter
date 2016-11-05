import {checkUserPassword, findUserByUserName} from '../models/user'
import jwt from 'jsonwebtoken'

export async function login (req, res) {
  const {username, password} = req.body

  const ok = await checkUserPassword(username, password)

  if (!ok) {
    const error = new Error('Invalid credentials')
    error.status = 401
    throw error
  }

  const user = await findUserByUserName(username)

  const token = jwt.sign({
    id: user._id
  }, process.env.SERVER_SECRET, {
    expiresIn: '2h'
  })

  res.send({
    user: { id: user._id },
    token: token
  })
}
