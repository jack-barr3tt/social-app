import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, UserInput } from './user.entity'
import { hash } from 'bcrypt'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>,
    ) {}

    async create(user: UserInput): Promise<User> {
        try {
            const newUser = new User()
            newUser.email = user.email
            newUser.username = user.username
            newUser.hash = await hash(user.password, 10)

            return this.repo.save(newUser)
        } catch {
            throw new Error('Error creating user')
        }
    }

    get(id: string): Promise<User> {
        return this.repo.findOne({
            where: { id },
            relations: {
                posts: true,
                chats: true,
                messages: true,
                friends: true,
                sentFriendRequests: true,
                receivedFriendRequests: true,
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
}
