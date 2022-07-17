import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/user.entity'
import { Repository } from 'typeorm'
import { Chat, ChatInput, ChatWithoutUsers } from './chat.entity'

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private repo: Repository<Chat>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}

    async create(chat: ChatInput, ownerId: string): Promise<ChatWithoutUsers> {
        const owner = await this.userRepo.findOne({
            where: { id: ownerId },
        })

        const members = await Promise.all(
            chat.userIds.map((userId) => {
                try {
                    return this.userRepo.findOne({ where: { id: userId } })
                } catch {
                    throw new Error(`Invalid user id: ${userId}`)
                }
            }),
        )

        const newChat = new Chat()
        newChat.name = chat.name
        newChat.owner = owner
        newChat.users = members
        if (!newChat.users.some((u) => u.id === newChat.owner.id))
            newChat.users.push(owner)

        return this.repo.save(newChat)
    }

    async get(id: string, currentUserId: string): Promise<Chat> {
        const user = await this.userRepo.findOne({
            where: { id: currentUserId },
            relations: { chats: true },
        })

        if (!user.chats.some((c) => c.id === id)) return null

        return this.repo.findOne({
            where: { id },
            relations: {
                owner: true,
                users: true,
                messages: {
                    user: true,
                },
            },
        })
    }

    async delete(id: string, currentUserId: string): Promise<string> {
        const chat = await this.repo.findOne({
            where: { id },
            relations: { owner: true },
        })

        if (!chat) throw new Error('Chat not found')

        if (chat.owner.id !== currentUserId)
            throw new Error('User does not own this chat')

        await this.repo.delete({ id })

        return 'Chat deleted'
    }

    async leave(id: string, userId: string): Promise<string> {
        const chat = await this.repo.findOne({
            where: { id },
            relations: { users: true },
        })

        if (!chat) throw new Error('Chat not found')
        if (!chat.users.some((u) => u.id === userId))
            throw new Error('User not in chat')

        chat.users = chat.users.filter((u) => u.id !== userId)
        if (!chat.nameOverriden) chat.updateName()

        await this.repo.save(chat)

        return 'User left chat'
    }

    async rename(
        id: string,
        name: string,
        currentUserId: string,
    ): Promise<string> {
        const chat = await this.repo.findOne({
            where: { id },
            relations: { users: true, owner: true },
        })

        if (!chat) throw new Error('Chat not found')
        if (chat.owner.id !== currentUserId)
            throw new Error('User does not own this chat')

        chat.name = name

        await this.repo.save(chat)

        return 'Renamed chat'
    }

    async editMembers(
        id: string,
        userIds: string[],
        currentUserId: string,
    ): Promise<string> {
        const chat = await this.repo.findOne({
            where: { id },
            relations: { users: true, owner: true },
        })

        if (!chat) throw new Error('Chat not found')

        if (chat.owner.id !== currentUserId)
            throw new Error('User does not own this chat')

        const members = await Promise.all(
            userIds.map((userId) => {
                try {
                    return this.userRepo.findOne({ where: { id: userId } })
                } catch {
                    throw new Error(`Invalid user id: ${userId}`)
                }
            }),
        )

        chat.users = members

        if (!chat.nameOverriden) chat.updateName()

        await this.repo.save(chat)

        return 'Members updated'
    }
}
