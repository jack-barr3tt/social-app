import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CASCADE } from 'src/cascade'
import { Chat } from 'src/chats/chat.entity'
import { User } from 'src/users/user.entity'
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm'
import { v4 } from 'uuid'

@InputType()
export class MessageInput {
    @Field()
    content: string

    @Field()
    chatId: string
}

@ObjectType()
@Entity()
export class Message {
    @PrimaryColumn()
    @Field()
    id: string

    @Column()
    @Field()
    content: string

    @Column({ default: false })
    @Field()
    edited: boolean

    @CreateDateColumn()
    @Field()
    createdAt: Date

    @ManyToOne(() => User, (user) => user.messages, CASCADE)
    @JoinColumn()
    @Field(() => User)
    user: User

    @ManyToOne(() => Chat, (chat) => chat.messages, CASCADE)
    @JoinColumn()
    @Field(() => Chat)
    chat: Chat

    @Column()
    chatId: string

    @BeforeUpdate()
    setEdited() {
        this.edited = true
    }

    @BeforeInsert()
    generateId() {
        this.id = v4()
    }
}

@ObjectType()
export class MessageWithoutRels {
    @Field()
    id: string

    @Field()
    content: string

    @Field()
    edited: boolean

    @Field()
    createdAt: Date
}
