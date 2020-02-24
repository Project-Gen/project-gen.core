import { NestFactory } from '@nestjs/core'
import { ConfigService } from './config/config.service'
import { AppModule } from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const configService = app.get(ConfigService)
  await app.listen(configService.get('port'))
}
bootstrap()
