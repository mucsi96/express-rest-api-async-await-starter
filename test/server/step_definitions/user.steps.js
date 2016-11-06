import request from 'supertest-as-promised'
import {jwtRegex, mongoDbIdRegex} from '../helpers'
import app from '../../../src/server/server'

export default function () {
  this.Given(/^I register with "([^"]*)" and "([^"]*)" password$/, async (username, password) => {
    this.res = await request(app)
      .post('/user')
      .send({username, password})
  })

  this.Then(/^I should be logged in$/, async () => {
    this.res.status.should.equal(201)
    this.res.body.token.should.to.match(jwtRegex)
    this.res.body.user.id.should.to.match(mongoDbIdRegex)
  })

  this.Then(/^I should get an error message "([^"]*)" and status code "([^"]*)"$/, async (errorMessage, statusCode) => {
    this.res.body.error.should.equal(errorMessage)
    this.res.status.should.equal(parseInt(statusCode))
  })
}


