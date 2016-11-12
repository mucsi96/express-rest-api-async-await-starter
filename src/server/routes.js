import {Router} from 'express'
import requireDir from 'require-dir'
import expressJwt from 'express-jwt'
import {getEnvProp} from './env'

const authenticate = expressJwt({secret : getEnvProp('SERVER_SECRET')})
const router = Router()
const controllers = requireDir('./controllers')
// Source https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/#usinges7asyncawait
const wrap = fn => (...args) => fn(...args).catch(args[2])

router.post('/api/user', wrap(controllers.user.create), wrap(controllers.auth.login))
router.post('/api/auth', wrap(controllers.auth.login))
router.get('/api/user', authenticate, wrap(controllers.user.get))

export default router
