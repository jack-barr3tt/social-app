import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CASCADE } from 'src/cascade'
import { Message } from 'src/messages/message.entity'
import { User } from 'src/users/user.entity'
import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
} from 'typeorm'
import { v4 } from 'uuid'

@InputType()
export class ChatInput {
    @Field({ nullable: true })
    name: string

    @Field(() => [String])
    userIds: string[]
}

@InputType()
export class ChatMemberEditInput {
    @Field(() => String)
    id: string

    @Field(() => [String])
    userIds: string[]
}

@Entity()
@ObjectType()
export class Chat {
    @PrimaryColumn()
    @Field()
    id: string

    @Column()
    @Field()
    name: string

    @Column({ default: false })
    nameOverriden: boolean

    @ManyToMany(() => User, (user) => user.chats)
    @JoinTable()
    @Field(() => [User])
    users: User[]

    @ManyToOne(() => User, (user) => user.ownedChats, CASCADE)
    @JoinColumn()
    @Field(() => User)
    owner: User

    @OneToMany(() => Message, (message) => message.chat)
    @Field(() => [Message])
    messages: Message[]

    updateName() {
        this.name = this.users.map((user) => user.username).join(', ')
    }

    @BeforeInsert()
    beforeInsert() {
        this.id = v4()
        if (!this.name) this.updateName()
        else this.nameOverriden = true
    }
}

@ObjectType()
export class ChatWithoutUsers {
    @Field()
    id: string

    @Field()
    name: string
}
