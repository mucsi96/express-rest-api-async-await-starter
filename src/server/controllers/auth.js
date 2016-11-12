import {checkUserPassword, findUserByUserName} from '../models/user'
import jwt from 'jsonwebtoken'
import createError from  'http-errors'
import {getEnvProp} from '../env'

export async function login (req, res) {
  const {username, password} = req.body

  const ok = await checkUserPassword(username, password)

  if (!ok) {
    throw createError(401, 'Invalid credentials')
  }

  const user = await findUserByUserName(username)

  const token = jwt.sign({
    id: user._id
  }, getEnvProp('SERVER_SECRET'), {
    expiresIn: '2h'
  })

  res.send({
    user: { id: user._id },
    token: token
  })
}
