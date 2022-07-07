import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
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

    @BeforeInsert()
    generateId() {
        this.id = v4()
    }
}
