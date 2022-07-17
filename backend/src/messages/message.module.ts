import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Chat } from 'src/chats/chat.entity'
import { User } from 'src/users/user.entity'
import { Message } from './message.entity'
import { MessageResolver } from './message.resolver'
import { MessageService } from './message.service'

@Module({
    imports: [TypeOrmModule.forFeature([Message, Chat, User])],
    providers: [MessageService, MessageResolver],
})
export class MessageModule {}
