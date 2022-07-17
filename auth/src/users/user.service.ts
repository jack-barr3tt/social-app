import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './user.entity'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>,
    ) {}

    async getOrCreate(googleId: string) {
        const user = await this.getByGoogleId(googleId)
        if (user) return user

        return this.create(googleId)
    }

    private getByGoogleId(googleId: string) {
        return this.repo.findOne({
            where: { googleId },
        })
    }

    private async create(googleId: string) {
        const user = new User()
        user.googleId = googleId

        return await this.repo.save(user)
    }
}
