import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Message, MessageInput, MessageWithoutRels } from './message.entity'
import { MessageService } from './message.service'

@Resolver()
export class MessageResolver {
    constructor(private readonly messageService: MessageService) {}

    @Mutation(() => MessageWithoutRels)
    async createMessage(
        @Args('message') message: MessageInput,
    ): Promise<MessageWithoutRels> {
        return this.messageService.create(message)
    }

    @Mutation(() => Message)
    async editMessage(
        @Args('id') id: string,
        @Args('newContent') newContent: string,
    ): Promise<Message> {
        return this.messageService.edit(id, newContent)
    }

    @Mutation(() => String)
    async deleteMessage(@Args('id') id: string): Promise<string> {
        return this.messageService.delete(id)
    }

    @Query(() => Message, { nullable: true })
    async message(@Args('id') id: string): Promise<Message> {
        return this.messageService.get(id)
    }
}
