import { NestFactory } from '@nestjs/core'
import { getConnection } from 'typeorm'
import { AppModule } from './app.module'

const init = async () => {
  const app = await NestFactory.create(AppModule)

  await getConnection().synchronize(true)
  await app.close()
}

init()
