import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { User } from 'src/users/user.entity'
import {
    AfterUpdate,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm'
import { v4 } from 'uuid'

@InputType()
export class PostInput {
    @Field()
    title: string

    @Field()
    content: string

    @Field()
    userId: string
}

@InputType()
export class PostEditInput {
    @Field()
    title: string

    @Field()
    content: string
}

@Entity()
@ObjectType()
export class Post {
    @PrimaryColumn()
    @Field()
    id: string

    @Column()
    @Field()
    title: string

    @Column()
    @Field()
    content: string

    @CreateDateColumn()
    @Field()
    createdAt: Date

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn()
    @Field(() => User)
    user: User

    @Column()
    userId: string

    @ManyToMany(() => User, (user) => user.likedPosts)
    @JoinTable()
    @Field(() => [User])
    likedBy: User[]

    @Field(() => Int)
    get likes() {
        return this.likedBy.length
    }

    @Column({ default: false })
    @Field()
    edited!: boolean

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
export class PostWithoutUsers {
    @Field()
    id: string

    @Field()
    title: string

    @Field()
    content: string

    @Field()
    createdAt: Date

    @Field(() => Int)
    likes: number
}
