import * as path from 'path'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/config.service'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): PostgresConnectionOptions => ({
        type: 'postgres',
        url: configService.get('pgUrl'),
        entities: [path.resolve(`${__dirname}/../**/*.entity{.ts,.js}`)],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
