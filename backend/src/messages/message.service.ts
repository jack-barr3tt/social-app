import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Chat } from 'src/chats/chat.entity'
import { User } from 'src/users/user.entity'
import { Repository } from 'typeorm'
import { Message, MessageInput, MessageWithoutRels } from './message.entity'

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) {}

    async create(message: MessageInput): Promise<MessageWithoutRels> {
        const newMessage = new Message()

        const tempUser = new User()
        tempUser.id = message.userId

        const tempChat = new Chat()
        tempChat.id = message.chatId

        newMessage.content = message.content
        newMessage.user = tempUser
        newMessage.chat = tempChat

        return this.messageRepository.save(newMessage)
    }

    async get(id: string): Promise<Message> {
        return this.messageRepository.findOne({
            where: { id },
            relations: { chat: true, user: true },
        })
    }

    async edit(id: string, newContent: string): Promise<Message> {
        const editedMessage = await this.messageRepository.findOne({
            where: { id },
            relations: { chat: true, user: true },
        })

        editedMessage.content = newContent

        return this.messageRepository.save(editedMessage)
    }

    async delete(id: string): Promise<string> {
        const deletedMessage = await this.messageRepository.findOne({
            where: { id },
            relations: { chat: true, user: true },
        })

        this.messageRepository.remove(deletedMessage)

        return 'Message deleted'
    }
}
