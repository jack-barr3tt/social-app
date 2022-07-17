import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/user.entity'
import { Repository } from 'typeorm'
import { Post, PostEditInput, PostInput, PostWithoutUsers } from './post.entity'

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private repo: Repository<Post>,

        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) {}

    async create(post: PostInput, userId: string): Promise<Post> {
        const newPost = new Post()
        newPost.title = post.title
        newPost.content = post.content
        newPost.userId = userId

        return this.repo.save(newPost)
    }

    async get(id: string, currentUserId: string): Promise<Post> {
        const user = await this.userRepo.findOne({
            where: { id: currentUserId },
            relations: { friends: true },
        })

        return this.repo.findOne({
            where: [user, ...user.friends].map((u) => ({ id, userId: u.id })),
            relations: { likedBy: true, user: true },
        })
    }

    async edit(id: string, changes: PostEditInput, currentUserId: string) {
        const post = await this.repo.findOne({
            where: { id },
            relations: { likedBy: true },
        })

        if (post.userId !== currentUserId)
            throw new Error('You are not the owner of this post')

        if (!post) throw new Error('Post not found')

        if (changes.title) post.title = changes.title
        if (changes.content) post.content = changes.content

        return this.repo.save(post)
    }

    async delete(id: string, currentUserId: string) {
        const post = await this.repo.findOne({
            where: { id },
        })

        if (!post) throw new Error('Post not found')

        if (post.userId !== currentUserId)
            throw new Error('You are not the owner of this post')

        await this.repo.remove(post)
        return 'Post deleted'
    }

    async like(userId: string, postId: string): Promise<PostWithoutUsers> {
        const post = await this.repo.findOne({
            where: { id: postId },
            relations: { likedBy: true },
        })

        if (!post) throw new Error('Post not found')

        if (post.likedBy.find((u) => u.id === userId)) {
            // If already liked, remove from likedBy
            post.likedBy = post.likedBy.filter((u) => u.id !== userId)
        } else {
            // If not liked, add to likedBy
            const tempUser = new User()
            tempUser.id = userId

            post.likedBy.push(tempUser)
        }

        let temp = await this.repo.save(post)

        return temp
    }

    async getFriendPosts(userId: string): Promise<PostWithoutUsers[]> {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: { friends: true },
        })

        if (!user) throw new Error('User not found')

        return this.repo.find({
            where: [...user.friends.map((f) => ({ userId: f.id })), { userId }],
            relations: { likedBy: true, user: true },
        })
    }
}
