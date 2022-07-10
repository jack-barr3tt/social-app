import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { FriendRequestService } from "./request.service";

@Resolver()
export class FriendRequestResolver {
    constructor(private readonly frService: FriendRequestService) {}

    @Mutation(() => String)
    async sendFriendRequest(@Args("senderId") senderId: string, @Args("receiverId") receiverId: string) {
        return this.frService.sendFriendRequest(senderId, receiverId);
    }

    @Mutation(() => String)
    async acceptFriendRequest(@Args("id") id: string) {
        return this.frService.acceptFriendRequest(id);
    }

    @Mutation(() => String)
    async rejectFriendRequest(@Args("id") id: string) {
        return this.frService.rejectFriendRequest(id);
    }

    @Mutation(() => String)
    async revokeFriendRequest(@Args("id") id: string) {
        return this.frService.revokeFriendRequest(id);
    }
}