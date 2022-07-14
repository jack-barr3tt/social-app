import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Post } from './post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
    imports: [TypeOrmModule.forFeature([Post, User])],
    providers: [PostService, PostResolver],
})
export class PostModule {};