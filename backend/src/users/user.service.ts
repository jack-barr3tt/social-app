import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, UserInput } from './user.entity'
import { hash } from 'bcrypt'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>,
    ) {}

    async create(user: UserInput): Promise<User> {
        try {
            const newUser = new User()
            newUser.email = user.email
            newUser.username = user.username
            newUser.hash = await hash(user.password, 10)

            return this.repo.save(newUser)
        } catch {
            throw new Error('Error creating user')
        }
    }

    findOne(id: string): Promise<User|null> {
        return this.repo.findOneBy({ id })
    }
}
