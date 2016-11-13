import {MongoClient} from 'mongodb'
import createError from 'http-errors'
import {getEnvProp} from '../env'

let db

function getMongoUrl () {
  const url = getEnvProp('MONGO_URL')
  const user = getEnvProp('MONGO_USER')
  const pass = getEnvProp('MONGO_PASS')

  return `mongodb://${user}${pass ? ':' : ''}${pass}@${url}`
}

export async function connectDB () {
  const url = getMongoUrl()
  db = await MongoClient.connect(url)
}

export async function manageDBIndexes () {
  await getDB().collection('users').createIndex({username: 1}, {unique: true, w: 1})
}

export function getDB () {
  if (!db) throw createError(500, 'Database connection error')
  return db
}

export async function closeDBconnection () {
  if (!db) return
  await db.close(true)
}
