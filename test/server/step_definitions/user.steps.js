import request from 'supertest-as-promised'
import {jwtRegex, mongoDbIdRegex} from '../helpers'
import app from '../../../src/server/server'

let loginResponse

export default function () {
  this.Given(/^I register with "([^"]*)" and "([^"]*)" password$/, async (username, password) => {
    loginResponse = await request(app)
      .post('/user')
      .send({username, password})
      .expect(201)
  })

  this.Then(/^I should be logged in$/, async () => {
    loginResponse.body.token.should.to.match(jwtRegex)
    loginResponse.body.user.id.should.to.match(mongoDbIdRegex)
  })
}


