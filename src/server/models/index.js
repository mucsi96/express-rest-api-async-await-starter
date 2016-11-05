import {MongoClient} from 'mongodb'
import assert from 'assert'

let db

function getMongoUrl () {
  const url = process.env.MONGO_URL
  const user = process.env.MONGO_USER
  const pass = process.env.MONGO_PASS

  return `mongodb://${user}${pass ? ':' : ''}${pass}@${url}`
}

export async function connectDB () {
  const url = getMongoUrl()
  db = await MongoClient.connect(url)
}

export function getDB () {
  assert(db, 'No MongoDB connection was estanblished yet!')
  return db
}

export async function closeDBconnection () {
  await db.close(true)
}
