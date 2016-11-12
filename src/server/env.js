import assert from 'assert'
import dotenv from 'dotenv'

dotenv.config()

export function getEnvProp (prop) {
  const result = process.env[prop]
  assert(typeof result !== 'undefined', `Please provide ${prop} in the .env file!`)
  return result
}
