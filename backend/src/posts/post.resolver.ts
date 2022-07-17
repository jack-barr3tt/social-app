import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Post, PostEditInput, PostInput, PostWithoutUsers } from './post.entity'
import { PostService } from './post.service'

@Resolver()
export class PostResolver {
    constructor(private readonly postService: PostService) {}

    @Mutation(() => Post)
    createPost(@Args('input') input: PostInput, @Context() context) {
        return this.postService.create(input, context.req.user.id)
    }

    @Mutation(() => PostWithoutUsers)
    like(@Args('postId') postId: string, @Context() context) {
        return this.postService.like(context.req.user.id, postId)
    }

    @Mutation(() => PostWithoutUsers)
    editPost(
        @Args('id') id: string,
        @Args('changes') changes: PostEditInput,
        @Context() context,
    ) {
        return this.postService.edit(id, changes, context.req.user.id)
    }

    @Mutation(() => String)
    deletePost(@Args('id') id: string, @Context() context) {
        return this.postService.delete(id, context.req.user.id)
    }

    @Query(() => Post, { nullable: true })
    post(@Args('id') id: string) {
        return this.postService.get(id)
    }

    @Query(() => [Post])
    friendPosts(@Context() context) {
        return this.postService.getFriendPosts(context.req.user.id)
    }
}
