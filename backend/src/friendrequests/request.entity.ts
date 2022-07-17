import { Field, ObjectType } from '@nestjs/graphql'
import { CASCADE } from 'src/cascade'
import { User } from 'src/users/user.entity'
import {
    BeforeInsert,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm'
import { v4 } from 'uuid'

@Entity()
@ObjectType()
export class FriendRequest {
    @PrimaryColumn()
    @Field(() => String)
    id!: string

    @ManyToOne(() => User, (user) => user.sentFriendRequests, CASCADE)
    @JoinColumn()
    @Field(() => User)
    sender!: User

    @ManyToOne(() => User, (user) => user.receivedFriendRequests, CASCADE)
    @JoinColumn()
    @Field(() => User)
    receiver!: User

    @BeforeInsert()
    generateId() {
        this.id = v4()
    }
}
