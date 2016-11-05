import pify from 'pify'
import bcrypt from 'bcrypt'
import {getDB} from '.'

const saltRounds = 10

export async function createUser (username, password) {
  const hash = await pify(bcrypt.hash)(password, saltRounds)

  await getDB().collection('user').insertOne({username, password: hash})
}

export async function findUserByUserName (username) {
  const user = await getDB().collection('user').findOne({username})
  return user
}

export async function checkUserPassword (username, password) {
  const user = await findUserByUserName(username)
  console.log(password, user)
  const ok = await pify(bcrypt.compare)(password, user.password)
  return ok
}
