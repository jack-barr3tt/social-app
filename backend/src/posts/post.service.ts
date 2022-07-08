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
    ) {}

    async create(post: PostInput): Promise<Post> {
        const newPost = new Post()
        newPost.title = post.title
        newPost.content = post.content
        newPost.userId = post.userId

        return this.repo.save(newPost)
    }

    async get(id: string): Promise<Post> {
        return this.repo.findOne({
            where: { id },
            relations: { likedBy: true },
        })
    }

    async edit(id: string, changes: PostEditInput) {
        const post = await this.repo.findOne({
            where: { id },
            relations: { likedBy: true },
        })

        if (!post) throw new Error('Post not found')

        if (changes.title) post.title = changes.title
        if (changes.content) post.content = changes.content

        return this.repo.save(post)
    }

    async delete(id: string) {
        const post = await this.repo.findOne({
            where: { id },
        })

        if (!post) throw new Error('Post not found')

        await this.repo.remove(post)
        return "Post deleted"
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
}
