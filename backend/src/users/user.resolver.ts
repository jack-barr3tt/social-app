import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User, UserInput } from './user.entity'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => User)
    async createUser(@Args('input') input: UserInput) {
        return this.userService.create(input)
    }

    @Query(() => User, { nullable: true })
    async user(@Args('id') id: string) {
        return this.userService.get(id)
    }
}
