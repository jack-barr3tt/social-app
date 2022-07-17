import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Like, Not } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>,
    ) {}

    getById(id: string) {
        return this.repo.findOne({
            where: { id },
        })
    }

    get(id: string): Promise<User> {
        return this.repo.findOne({
            where: { id },
            relations: {
                posts: true,
                chats: {
                    users: true,
                    owner: true,
                },
                messages: true,
                friends: true,
                sentFriendRequests: {
                    sender: true,
                    receiver: true,
                },
                receivedFriendRequests: {
                    sender: true,
                    receiver: true,
                },
            },
        })
    }

    async unfriend(userId: string, friendId: string): Promise<string> {
        if (userId === friendId) {
            throw new Error('You cannot unfriend yourself')
        }

        const [user, friend] = await Promise.all([
            this.repo.findOne({
                where: { id: userId },
                relations: { friends: true },
            }),
            this.repo.findOne({
                where: { id: friendId },
                relations: { friends: true },
            }),
        ])

        if (!user || !friend) {
            throw new Error('User not found')
        }

        if (!user.friends.some((friend) => friend.id === friendId)) {
            throw new Error('User is not your friend')
        }

        user.friends = user.friends.filter((friend) => friend.id !== friendId)
        friend.friends = friend.friends.filter((friend) => friend.id !== userId)

        await Promise.all([this.repo.save(user), this.repo.save(friend)])

        return 'Successfully unfriended'
    }

    search(query: string, currentUserId: string) {
        return this.repo.find({
            where: {
                username: Like(`%${query}%`),
                id: Not(currentUserId),
            },
        })
    }

    async setUsername(id: string, username: string) {
        const user = await this.repo.findOne({
            where: { id },
        })

        if (!user) {
            throw new Error('User not found')
        }

        user.username = username

        await this.repo.save(user)

        return 'Successfully updated username'
    }
}
