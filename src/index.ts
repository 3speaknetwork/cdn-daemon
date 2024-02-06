import { CoreService } from './services/core.service'
import { ConfigService } from './config.service'
import { MongoClient } from 'mongodb'
import { logger } from './common/logger.singleton'
import { ApiModule } from './api/api.module'
import { create } from 'kubo-rpc-client'

async function startup(): Promise<void> {
  console.log('running')

  // connect to the default API address http://localhost:5001
  // const ipfs_client = create()
  // console.log('ipfs client is running ... ')

  const MONGO_HOST = ConfigService.getConfig().mongoHost
  const url = `mongodb://${MONGO_HOST}`
  const mongo = new MongoClient(url)
  await mongo.connect()
  logger.info(`Connected successfully to mongo at ${MONGO_HOST}`)
  const instance = new CoreService(mongo)
  await instance.start()

  const api = new ApiModule()
  api.listen(instance)
}

void startup()

process.on('unhandledRejection', (error: Error) => {
  console.log(error)
  console.log('unhandledRejection', error.message)
})
