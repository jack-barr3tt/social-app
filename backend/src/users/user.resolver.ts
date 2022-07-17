import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User, UserInput } from './user.entity'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => User)
    async createUser(@Args('input') input: UserInput) {
        return this.userService.create(input)
    }

    @Mutation(() => String)
    async unfriend(@Args('friendId') friendId: string, @Context() context) {
        return this.userService.unfriend(context.req.user.id, friendId)
    }

    @Query(() => User, { nullable: true })
    async user(@Args('id') id: string) {
        return this.userService.get(id)
    }

    @Query(() => [User])
    async search(@Args('query') query: string, @Context() context) {
        return this.userService.search(query, context.req.user.id)
    }
}
