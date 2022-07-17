import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
    Chat,
    ChatInput,
    ChatMemberEditInput,
    ChatWithoutUsers,
} from './chat.entity'
import { ChatService } from './chat.service'

@Resolver()
export class ChatResolver {
    constructor(private readonly chatService: ChatService) {}

    @Mutation(() => ChatWithoutUsers)
    async createChat(
        @Args('chat') chat: ChatInput,
        @Context() context,
    ): Promise<ChatWithoutUsers> {
        return this.chatService.create(chat, context.req.user.id)
    }

    @Mutation(() => String)
    async deleteChat(
        @Args('id') id: string,
        @Context() context,
    ): Promise<string> {
        return this.chatService.delete(id, context.req.user.id)
    }

    @Mutation(() => String)
    async leaveChat(
        @Args('id') id: string,
        @Context() context,
    ): Promise<string> {
        return this.chatService.leave(id, context.req.user.id)
    }

    @Mutation(() => String)
    async renameChat(
        @Args('id') id: string,
        @Args('name') name: string,
        @Context() context,
    ): Promise<string> {
        return this.chatService.rename(id, name, context.req.user.id)
    }

    @Mutation(() => String)
    async editMembers(
        @Args('changes') { id, userIds }: ChatMemberEditInput,
        @Context() context,
    ): Promise<string> {
        return this.chatService.editMembers(id, userIds, context.req.user.id)
    }

    @Query(() => Chat, { nullable: true })
    async chat(@Args('id') id: string): Promise<Chat> {
        return this.chatService.get(id)
    }
}
