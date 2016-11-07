import chai from 'chai'
import {startServer, stopServer} from '../../../src/server/server'
import {getDB} from '../../../src/server/models'

chai.should()

export default function () {
  this.BeforeFeatures(async () => {
    await startServer()
  })

  this.AfterScenario(async () => {
    await getDB().dropDatabase()
  })

  this.AfterFeatures(async () => {
    await stopServer()
  })
}
