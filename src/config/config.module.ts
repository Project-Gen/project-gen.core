import { Module } from '@nestjs/common'
import {
  ConfigModule as NestConfigModule,
  ConfigService as NestConfigService,
} from '@nestjs/config'
import { getConfig } from './config.lib'
import { ConfigService } from './config.service'
import { NEST_CONFIG_SERVICE } from './config.constants'

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [getConfig],
    }),
  ],
  providers: [
    {
      provide: NEST_CONFIG_SERVICE,
      useClass: NestConfigService,
    },
    ConfigService,
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
