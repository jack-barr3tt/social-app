import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { User, UserBasic } from './user.entity'
import { UserService } from './user.service'

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => String)
    async setUsername(@Args('username') username: string, @Context() context) {
        return this.userService.setUsername(context.req.user.id, username)
    }

    @Mutation(() => String)
    async unfriend(@Args('friendId') friendId: string, @Context() context) {
        return this.userService.unfriend(context.req.user.id, friendId)
    }

    @Query(() => User, { nullable: true })
    async user(
        @Context() context
    ) {
        return this.userService.get(context.req.user.id)
    }

    @Query(() => UserBasic, { nullable: true })
    async userById(@Args('id') id: string) {
        return this.userService.getById(id)
    }

    @Query(() => [User])
    async search(@Args('query') query: string, @Context() context) {
        return this.userService.search(query, context.req.user.id)
    }
}
