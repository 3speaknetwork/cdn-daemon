import { NestFactory } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { CdnMiddlewareController } from './controllers/cdn-middleware.controller'
import { AdminController } from './controllers/admin.controller'
import { CoreService } from '../services/core.service'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

export const coreContainer: { self: CoreService } = {} as any

@Module({
  imports: [],
  controllers: [CdnMiddlewareController, AdminController],
  providers: [],
})
class ControllerModule {}

export class ApiModule {
  instance: CoreService
  public async listen(instance) {
    this.instance = instance
    coreContainer.self = instance
    const app2 = await NestFactory.create<NestFastifyApplication>(
      ControllerModule,
      new FastifyAdapter(),
    )
    await app2.listen(18081)
    const app = await NestFactory.create(ControllerModule)

    const swaggerconfig = new DocumentBuilder().setTitle('SPK Indexer CDN Daemon').build()
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerconfig)
    SwaggerModule.setup('swagger', app, swaggerDocument)

    await app.listen(18080)
    console.log('listening on Port 18080')
  }
}
