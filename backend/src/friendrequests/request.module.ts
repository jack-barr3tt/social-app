import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/users/user.entity'
import { FriendRequest } from './request.entity'
import { FriendRequestResolver } from './request.resolver'
import { FriendRequestService } from './request.service'

@Module({
    imports: [TypeOrmModule.forFeature([FriendRequest, User])],
    providers: [FriendRequestResolver, FriendRequestService],
})
export class FriendRequestModule {}
