import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { sign } from 'jsonwebtoken'
import { UserService } from 'src/users/user.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly userService: UserService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'],
        })
    }

    async validate(_a, _r, profile: any) {
        const user = await this.userService.getOrCreate(profile.id)

        const payload = {
            sub: user.id,
            googleId: profile.id,
        }

        const token = sign(payload, process.env.JWT_SECRET, {
            expiresIn: '30m',
        })

        return { ...user, token }
    }
}
