import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
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
    async createChat(@Args('chat') chat: ChatInput): Promise<ChatWithoutUsers> {
        return this.chatService.create(chat)
    }

    @Mutation(() => String)
    async deleteChat(@Args('id') id: string): Promise<string> {
        return this.chatService.delete(id)
    }

    @Mutation(() => String)
    async leaveChat(
        @Args('id') id: string,
        @Args('userId') userId: string,
    ): Promise<string> {
        return this.chatService.leave(id, userId)
    }

    @Mutation(() => String)
    async renameChat(
        @Args('id') id: string,
        @Args('name') name: string,
    ): Promise<string> {
        return this.chatService.rename(id, name)
    }

    @Mutation(() => String)
    async editMembers(
        @Args('changes') { id, userIds }: ChatMemberEditInput,
    ): Promise<string> {
        return this.chatService.editMembers(id, userIds)
    }

    @Query(() => Chat, { nullable: true })
    async chat(@Args('id') id: string): Promise<Chat> {
        return this.chatService.get(id)
    }
}
