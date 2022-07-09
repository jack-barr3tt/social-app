import { Field, ObjectType } from '@nestjs/graphql'
import { User } from 'src/users/user.entity'
import { BeforeInsert, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { v4 } from 'uuid'

@Entity()
@ObjectType()
export class FriendRequest {
    @PrimaryColumn()
    @Field(() => String)
    id!: string

    @ManyToOne(() => User, (user) => user.sentFriendRequests)
    @JoinColumn()
    @Field(() => User)
    sender!: User

    @ManyToOne(() => User, (user) => user.receivedFriendRequests)
    @JoinColumn()
    @Field(() => User)
    receiver!: User

    @BeforeInsert()
    generateId() {
        this.id = v4()
    }
}
