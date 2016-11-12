import request from 'supertest-as-promised'
import {jwtRegex, mongoDbIdRegex} from '../helpers'
import app from '../../../src/server/server'
import {getDB} from '../../../src/server/models'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {getEnvProp} from '../../../src/server/env'

export default function () {
  this.Given(/^I register with "([^"]*)" username and "([^"]*)" password$/, async (username, password) => {
    this.res = await request(app)
      .post('/api/user')
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
      .post('/api/auth')
      .send({username, password})
  })

  this.When(/^I am logged in$/, async () => {
    this.user = {
      username: 'Jack'
    }
    const result = await getDB().collection('users').insertOne({
      username: this.user.username
    })

    this.user.id = result.insertedId.toString()
    this.token = jwt.sign({
      id: this.user.id
    }, getEnvProp('SERVER_SECRET'), {
      expiresIn: '2h'
    })
  })

  this.When(/^I request private user info without authorization token$/, async () => {
    this.res = await request(app)
      .get('/api/user')
  });

  this.When(/^I request private user info with wrong authorization token$/, async () => {
    const badToken = jwt.sign({
      id: 0
    }, 'wrongsecret', {
      expiresIn: '2h'
    })
    this.res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${badToken}`)
  });

  this.When(/^I request private user info with correct authorization token$/, async () => {
    this.res = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${this.token}`)
  });

  this.Then(/^I should get my user info$/, async () => {
    this.res.body.user.id.should.equal(this.user.id)
    this.res.body.user.username.should.equal(this.user.username)
  });
}


