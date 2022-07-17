import { Field, ObjectType } from '@nestjs/graphql'
import { CASCADE } from 'src/cascade'
import { Chat } from 'src/chats/chat.entity'
import { FriendRequest } from 'src/friendrequests/request.entity'
import { Message } from 'src/messages/message.entity'
import { Post } from 'src/posts/post.entity'
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryColumn,
} from 'typeorm'

@ObjectType()
export class UserBasic {
    @Field()
    id!: string

    @Field({ nullable: true })
    username: string
}

@Entity()
@ObjectType()
export class User {
    @PrimaryColumn()
    @Field(() => String)
    id!: string

    @Column({ default: 'e' })
    googleId: string

    @Column({ length: 100, unique: true, nullable: true })
    @Field(() => String)
    username: string

    @OneToMany(() => Post, (post) => post.user)
    @Field(() => [Post])
    posts: Post[]

    @ManyToMany(() => Post, (post) => post.likedBy, CASCADE)
    @Field(() => [Post])
    likedPosts: Post[]

    @ManyToMany(() => Chat, (chat) => chat.users, CASCADE)
    @Field(() => [Chat])
    chats: Chat[]

    @OneToMany(() => Chat, (chat) => chat.owner)
    @Field(() => [Chat])
    ownedChats: Chat[]

    @OneToMany(() => Message, (message) => message.user)
    @Field(() => [Message])
    messages: Message[]

    @ManyToMany(() => User, (user) => user.friends, CASCADE)
    @JoinTable()
    @Field(() => [User])
    friends: User[]

    @OneToMany(() => FriendRequest, (request) => request.sender)
    @Field(() => [FriendRequest])
    sentFriendRequests: FriendRequest[]

    @OneToMany(() => FriendRequest, (request) => request.receiver)
    @Field(() => [FriendRequest])
    receivedFriendRequests: FriendRequest[]
}
