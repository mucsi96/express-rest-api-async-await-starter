import {startServer, stopServer} from './server'

const logger = console

function wrapWithErrorLogger (fn) {
  return () => fn().catch((err) => {
    logger.error(err)
  })
}

process.on('SIGINT', wrapWithErrorLogger(() => stopServer(logger, true)))
process.on('SIGTERM', wrapWithErrorLogger(() => stopServer(logger, true)))
wrapWithErrorLogger(() => startServer(logger))()
