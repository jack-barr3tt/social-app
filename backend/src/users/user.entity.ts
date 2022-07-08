import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Chat } from 'src/chats/chat.entity'
import { Message } from 'src/messages/message.entity'
import { Post } from 'src/posts/post.entity'
import {
    BeforeInsert,
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryColumn,
} from 'typeorm'
import { v4 } from 'uuid'

@InputType()
export class UserInput {
    @Field()
    username: string

    @Field()
    email: string

    @Field()
    password: string
}

@Entity()
@ObjectType()
export class User {
    @PrimaryColumn()
    @Field(() => String)
    id!: string

    @Column({ length: 100 })
    @Field(() => String)
    username!: string

    @Column({ length: 300 })
    @Field(() => String)
    email!: string

    @Column()
    hash!: string

    @OneToMany(() => Post, (post) => post.user)
    @Field(() => [Post])
    posts: Post[]

    @ManyToMany(() => Post, (post) => post.likedBy)
    @Field(() => [Post])
    likedPosts: Post[]

    @ManyToMany(() => Chat, (chat) => chat.users)
    @Field(() => [Chat])
    chats: Chat[]

    @OneToMany(() => Chat, chat => chat.owner)
    @Field(() => [Chat])
    ownedChats: Chat[]

    @OneToMany(() => Message, (message) => message.user)
    @Field(() => [Message])
    messages: Message[]

    @BeforeInsert()
    generateId() {
        this.id = v4()
    }
}
