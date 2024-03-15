import { NestFactory } from '@nestjs/core'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { CdnMiddlewareController } from './controllers/cdn-middleware.controller'
import { AdminController } from './controllers/admin.controller'
import { CoreService } from '../services/core.service'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

export const coreContainer: { self: CoreService } = {} as any
// const schedule = require('node-schedule')
import schedule from 'node-schedule'
import { deleteStats, fetchRecordsOlderThan } from './Middlewares/statsLoggerMiddleware'
import { HubController } from './controllers/hub.controller'
import { HubService } from '../services/hub.service'
import { AuthMiddleware } from './Middlewares/auth.middleware'

@Module({
  imports: [],
  controllers: [CdnMiddlewareController, AdminController, HubController],
  providers: [HubService],
})
class ControllerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('/hub/register');
  }
}

export class ApiModule {
  instance: CoreService
  public async listen(instance) {
    this.instance = instance
    coreContainer.self = instance
    const app2 = await NestFactory.create(
      ControllerModule,
      // new FastifyAdapter(),
    )
    await app2.listen(18081)
    const app = await NestFactory.create(ControllerModule)

    const swaggerconfig = new DocumentBuilder().setTitle('SPK Indexer CDN Daemon').build()
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerconfig)
    SwaggerModule.setup('swagger', app, swaggerDocument)

    await app.listen(18080)
    console.log('listening on Port 18080')

    /**
     * Node scheduler
     */
    const job = schedule.scheduleJob('0 0 * * *', async function () {
      try {
        console.log('Deleting records older than 14 days...')

        // Calculate the timestamp for 14 days ago
        const fourteenDaysAgo = new Date()
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
        const timestampFourteenDaysAgo = parseInt('' + fourteenDaysAgo.getTime() / 1000)

        // Fetch records older than 14 days and delete them
        const recordsToDelete = await fetchRecordsOlderThan(timestampFourteenDaysAgo)

        for (const record of recordsToDelete) {
          await deleteStats(record._id)
        }

        console.log('Deletion complete.')
      } catch (error) {
        console.error('Error in scheduled job:', error)
      }
    })
    // const job = schedule.scheduleJob('* * * * *', async function () {
    //   try {
    //     console.log('Deleting records older than 1 minute...')

    //     // Calculate the timestamp for 1 minute ago
    //     const oneMinuteAgo = new Date()
    //     oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1)
    //     const timestampOneMinuteAgo = parseInt('' + oneMinuteAgo.getTime() / 1000)

    //     // Fetch records older than 1 minute and delete them
    //     const recordsToDelete = await fetchRecordsOlderThan(timestampOneMinuteAgo)

    //     for (const record of recordsToDelete) {
    //       await deleteStats(record._id)
    //     }

    //     console.log('Deletion complete.')
    //   } catch (error) {
    //     console.error('Error in scheduled job:', error)
    //   }
    // })
  }
}
