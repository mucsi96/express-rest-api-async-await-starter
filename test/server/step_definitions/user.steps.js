import request from 'supertest-as-promised'
import {jwtRegex, mongoDbIdRegex} from '../helpers'
import app from '../../../src/server/server'
import {getDB} from '../../../src/server/models'
import bcrypt from 'bcrypt'

export default function () {
  this.Given(/^I register with "([^"]*)" username and "([^"]*)" password$/, async (username, password) => {
    this.res = await request(app)
      .post('/user')
      .send({username, password})
  })

  this.Then(/^I should be logged in$/, async () => {
    this.res.body.token.should.to.match(jwtRegex)
    this.res.body.user.id.should.to.match(mongoDbIdRegex)
  })

  this.Then(/^I should get an error message "([^"]*)"$/, async (errorMessage) => {
    this.res.body.error.should.equal(errorMessage)
  })

  this.Then(/^the status code should be "([^"]*)"$/, async (statusCode) => {
    this.res.status.should.equal(parseInt(statusCode))
  })

  this.Given(/^I am a register user with "([^"]*)" username and "([^"]*)" password$/, async (username, password) => {
    await getDB().collection('users').insertOne({
      username: username,
      password: bcrypt.hashSync(password, 10)
    })
  })

  this.When(/^I login with "([^"]*)" username and "([^"]*)" password$/, async (username, password) => {
    this.res = await request(app)
      .post('/auth')
      .send({username, password})
  })
}


