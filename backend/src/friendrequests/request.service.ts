import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/user.entity'
import { Repository } from 'typeorm'
import { FriendRequest } from './request.entity'

@Injectable()
export class FriendRequestService {
    constructor(
        @InjectRepository(FriendRequest)
        private readonly repo: Repository<FriendRequest>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async sendFriendRequest(
        senderId: string,
        receiverId: string,
    ): Promise<string> {
        if (senderId === receiverId) {
            throw new Error('You cannot send friend request to yourself')
        }

        const relationsToFetch = {
            friends: true,
            sentFriendRequests: {
                receiver: true,
            },
            receivedFriendRequests: {
                sender: true,
            },
        }

        const [sender, receiver] = await Promise.all([
            this.userRepo.findOne({
                where: { id: senderId },
                relations: relationsToFetch,
            }),
            this.userRepo.findOne({
                where: { id: receiverId },
                relations: relationsToFetch,
            }),
        ])

        if (!sender || !receiver) {
            throw new Error('User not found')
        }

        if (sender.friends.some((friend) => friend.id === receiverId)) {
            throw new Error('User is already your friend')
        }

        if (
            sender.sentFriendRequests.some(
                (request) => request.receiver.id === receiverId,
            )
        ) {
            throw new Error('You already sent a friend request to this user')
        }

        if (
            receiver.receivedFriendRequests.some(
                (request) => request.sender.id === senderId,
            )
        ) {
            throw new Error(
                'You already received a friend request from this user',
            )
        }

        const request = new FriendRequest()
        request.sender = sender
        request.receiver = receiver
        await this.repo.save(request)
        return 'Friend request sent'
    }

    async acceptFriendRequest(id: string): Promise<string> {
        const request = await this.repo.findOne({
            where: { id },
            relations: {
                sender: {
                    friends: true,
                },
                receiver: {
                    friends: true,
                },
            },
        })

        if (!request) {
            throw new Error('Friend request not found')
        }

        request.receiver.friends.push(request.sender)
        request.sender.friends.push(request.receiver)

        await Promise.all([
            this.userRepo.save(request.sender),
            this.userRepo.save(request.receiver),
            this.repo.remove(request),
        ])

        return 'Friend request accepted'
    }

    async rejectFriendRequest(id: string): Promise<string> {
        const request = await this.repo.findOne({
            where: { id },
        })

        if (!request) {
            throw new Error('Friend request not found')
        }

        await this.repo.remove(request)

        return 'Friend request rejected'
    }

    async revokeFriendRequest(id: string): Promise<string> {
        const request = await this.repo.findOne({
            where: { id },
        })

        if (!request) {
            throw new Error('Friend request not found')
        }

        await this.repo.remove(request)

        return 'Friend request revoked'
    }
}
