import { Module } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { DatabaseModule } from '../database/database.module'
import { UsersModule } from '../users/users.module'
import { AuthModule } from '../auth/auth.module'
import { ProjectsModule } from '../projects/projects.module'

@Module({
  imports: [ConfigModule, DatabaseModule, UsersModule, AuthModule, ProjectsModule],
})
export class AppModule {}
