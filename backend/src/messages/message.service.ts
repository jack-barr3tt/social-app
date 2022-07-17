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
        @InjectRepository(Chat)
        private readonly chatRepo: Repository<Chat>,
    ) {}

    async create(
        message: MessageInput,
        currentUserId: string,
    ): Promise<MessageWithoutRels> {
        const newMessage = new Message()

        const tempUser = new User()
        tempUser.id = currentUserId

        const chat = await this.chatRepo.findOne({
            where: { id: message.chatId },
            relations: {
                users: true,
            },
        })

        if (!chat.users.some((u) => u.id === currentUserId))
            throw new Error('You are not a member of this chat')

        newMessage.content = message.content
        newMessage.user = tempUser
        newMessage.chat = chat

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

        if (!deletedMessage) throw new Error('Message not found')

            throw new Error('You are not the owner of this message')
        this.messageRepository.delete({ id })

        return 'Message deleted'
    }
}
