import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Message, MessageInput, MessageWithoutRels } from './message.entity'
import { MessageService } from './message.service'

@Resolver()
export class MessageResolver {
    constructor(private readonly messageService: MessageService) {}

    @Mutation(() => MessageWithoutRels)
    async createMessage(
        @Args('message') message: MessageInput,
        @Context() context,
    ): Promise<MessageWithoutRels> {
        return this.messageService.create(message, context.req.user.id)
    }

    @Mutation(() => Message)
    async editMessage(
        @Args('id') id: string,
        @Args('newContent') newContent: string,
        @Context() context,
    ): Promise<Message> {
        return this.messageService.edit(id, newContent, context.req.user.id)
    }

    @Mutation(() => String)
    async deleteMessage(
        @Args('id') id: string,
        @Context() context,
    ): Promise<string> {
        return this.messageService.delete(id, context.req.user.id)
    }

    @Query(() => Message, { nullable: true })
    async message(
        @Args('id') id: string,
        @Context() context,
    ): Promise<Message> {
        return this.messageService.get(id, context.req.user.id)
    }
}
