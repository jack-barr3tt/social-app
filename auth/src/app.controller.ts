import { Controller, Get, Post, Redirect, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
@Controller()
export class AppController {
    constructor() {}

    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req) {}

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    @Redirect()
    googleAuthRedirect(@Req() req) {
        return { url: `http://localhost:4000/auth?token=${req.user.token}` }
    }
}
