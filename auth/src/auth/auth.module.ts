import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from 'src/users/user.module'
import { GoogleStrategy } from './googe.strategy'

@Module({
    imports: [UsersModule, PassportModule],
    providers: [GoogleStrategy],
})
export class AuthModule {}
