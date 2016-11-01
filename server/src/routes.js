import {Router} from 'express'
import requireDir from 'require-dir'

const router = Router()
const controllers = requireDir('./controllers')
// Source https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/#usinges7asyncawait
const wrap = fn => (...args) => fn(...args).catch(args[2])

router.get('/', wrap(controllers.home.get))

export default router
