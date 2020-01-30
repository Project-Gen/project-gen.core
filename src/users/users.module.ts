import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './user.entity'
import { UsersStorage } from './users.storage'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersStorage],
  exports: [UsersStorage],
})
export class UsersModule {}
