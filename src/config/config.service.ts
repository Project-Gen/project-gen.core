import { Injectable, Inject } from '@nestjs/common'
import { ConfigService as NestConfigService } from '@nestjs/config'
import { getConfig } from './config.lib'
import { NEST_CONFIG_SERVICE } from './config.constants'

@Injectable()
export class ConfigService {
  constructor(@Inject(NEST_CONFIG_SERVICE) readonly nestConfigService: NestConfigService) {}

  get(key?: keyof ReturnType<typeof getConfig>) {
    return this.nestConfigService.get(key)
  }
}
