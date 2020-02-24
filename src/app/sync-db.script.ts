import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { getConnection } from 'typeorm'

const init = async () => {
  const app = await NestFactory.create(AppModule)

  await getConnection().synchronize(true)
  await app.close()
}

init()
