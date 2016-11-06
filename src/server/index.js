import {startServer, stopServer} from './server'
import logger from './logger'

function wrapWithErrorLogger (fn) {
  return () => fn().catch((err) => {
    logger.error(err)
  })
}

process.on('SIGINT', wrapWithErrorLogger(() => stopServer(true)))
process.on('SIGTERM', wrapWithErrorLogger(() => stopServer(true)))
wrapWithErrorLogger(() => startServer())()
