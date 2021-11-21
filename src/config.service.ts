export interface IndexerAppConfig {
    mongoDatabaseName: string
    mongoHost: string
    ipfsHost: string
    apiListenPort: number
    testMode: boolean
  }
  
  export class ConfigService {
    static getConfig(): IndexerAppConfig {
      let apiListenPort
      if (process.env.API_LISTEN_PORT) {
        try {
          apiListenPort = parseInt(process.env.API_LISTEN_PORT)
        } catch (err) {
          throw new Error(
            `Error parsing api listen port!  ${process.env.API_LISTEN_PORT} is not a valid number`,
          )
        }
      } else {
        apiListenPort = 5551
      }
  
      return {
        mongoDatabaseName: process.env.MONGO_DATABASE || 'spk-cdn-daemon',
        mongoHost: process.env.MONGO_HOST || 'localhost:27017',
        ipfsHost: process.env.IPFS_HOST || 'localhost:5001',
        apiListenPort,
        testMode: process.env.TEST_MODE === 'true',
      }
    }
  }
  