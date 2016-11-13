import letsencrypt from 'letsencrypt-express'
import letsencryptChallengeFs from 'le-challenge-fs'
import letsencryptStoreCertbot from 'le-store-certbot'
import localhostHttpsOptions from 'localhost.daplie.com-certificates'
import {getEnvProp} from './env'

const lex = letsencrypt.create({
  server: !process.env.NODE_ENV ? 'staging' : 'https://acme-v01.api.letsencrypt.org/directory',
  challenges: {'http-01': letsencryptChallengeFs.create({webrootPath: '/tmp/acme-challenges'})},
  store: letsencryptStoreCertbot.create({webrootPath: '/tmp/acme-challenges'}),
  approveDomains: (opts, certs, cb) => {
    if (certs) {
      opts.domains = certs.altnames
    } else {
      opts.email = getEnvProp('LETSENCRYPT_EMAIL')
      opts.agreeTos = true
    }
    cb(null, {options: opts, certs})
  }
})

export const httpsOptions = !process.env.NODE_ENV ? localhostHttpsOptions.merge({}) : lex.httpsOptions
export const lexMiddleware = lex.middleware
export const httpsHost = !process.env.NODE_ENV && 'localhost.daplie.com'
