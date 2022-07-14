import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Post, PostEditInput, PostInput, PostWithoutUsers } from './post.entity'
import { PostService } from './post.service'

@Resolver()
export class PostResolver {
    constructor(private readonly postService: PostService) {}

    @Mutation(() => Post)
    createPost(@Args('input') input: PostInput) {
        return this.postService.create(input)
    }

    @Mutation(() => PostWithoutUsers)
    like(@Args('userId') userId: string, @Args('postId') postId: string) {
        return this.postService.like(userId, postId)
    }

    @Mutation(() => PostWithoutUsers)
    editPost(@Args('id') id: string, @Args('changes') changes: PostEditInput) {
        return this.postService.edit(id, changes)
    }

    @Mutation(() => String)
    deletePost(@Args('id') id: string) {
        return this.postService.delete(id)
    }

    @Query(() => Post, { nullable: true })
    post(@Args('id') id: string) {
        return this.postService.get(id)
    }

    @Query(() => [Post])
    friendPosts(@Args('userId') userId: string) {
        return this.postService.getFriendPosts(userId)
    }
}
