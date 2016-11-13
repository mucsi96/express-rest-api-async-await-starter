import {ObjectID} from 'mongodb'
import pify from 'pify'
import bcrypt from 'bcrypt'
import {getDB} from '.'
import createError from 'http-errors'

const promiseBcrypt = pify(bcrypt, { include: ['hash', 'compare'] })

const saltRounds = 10

export async function createUser (username, password) {
  const hash = await promiseBcrypt.hash(password, saltRounds)
  const result = await getDB()
    .collection('users')
    .updateOne({username}, {$setOnInsert: {username, password: hash}}, {upsert: true, w: 1})

  if (result.upsertedCount !== 1) {
    throw createError(409, 'You are already registered')
  }
}

export async function findUserById (id) {
  const user = await getDB()
    .collection('users')
    .findOne({_id: new ObjectID(id)})
  return user
}

export async function findUserByUserName (username) {
  const user = await getDB()
    .collection('users')
    .findOne({username})
  return user
}

export async function checkUserPassword (username, password) {
  const user = await findUserByUserName(username)
  if (!user) return false
  const ok = await promiseBcrypt.compare(password, user.password)
  return ok
}
