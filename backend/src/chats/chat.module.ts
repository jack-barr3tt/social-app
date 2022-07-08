import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/users/user.entity'
import { Chat } from './chat.entity'
import { ChatResolver } from './chat.resolver'
import { ChatService } from './chat.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat]),
        TypeOrmModule.forFeature([User]),
    ],
    providers: [ChatService, ChatResolver],
})
export class ChatModule {}
