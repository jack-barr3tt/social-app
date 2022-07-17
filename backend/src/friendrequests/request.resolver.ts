import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { FriendRequestService } from './request.service'

@Resolver()
export class FriendRequestResolver {
    constructor(private readonly frService: FriendRequestService) {}

    @Mutation(() => String)
    async sendFriendRequest(
        @Args('receiverId') receiverId: string,
        @Context() context,
    ) {
        return this.frService.sendFriendRequest(context.req.user.id, receiverId)
    }

    @Mutation(() => String)
    async acceptFriendRequest(@Args('id') id: string, @Context() context) {
        return this.frService.acceptFriendRequest(id, context.req.user.id)
    }

    @Mutation(() => String)
    async rejectFriendRequest(@Args('id') id: string, @Context() context) {
        return this.frService.rejectFriendRequest(id, context.req.user.id)
    }

    @Mutation(() => String)
    async revokeFriendRequest(@Args('id') id: string, @Context() context) {
        return this.frService.revokeFriendRequest(id, context.req.user.id)
    }
}
