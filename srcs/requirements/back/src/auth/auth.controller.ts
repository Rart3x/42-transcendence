import { Controller,  Get, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

dotenv.config();

@Controller('auth')
export class AuthController {
    constructor(
        private readonly UserService: UserService,
        private readonly JwtService: JwtService){}

    @Get('login')
    async makeAuth42(
        @Query('code') code: string,
        @Res() res: Response,
        ) : Promise<any>{
        try {
            if (code) {
                // console.log(code);
                //Fetch to retrieve the bearer token with query code 
                const response = await fetch("https://api.intra.42.fr/oauth/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        grant_type: "authorization_code",
                        client_id: process.env.VITE_CLIENT_ID,
                        client_secret: process.env.VITE_CLIENT_SECRET,
                        code: code,
                        redirect_uri: process.env.VITE_REDIRECT_URI
                    }),
                });
                if (!response.ok)
                    throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                const token = data.access_token;

                if (token){
                    //Fetch to retrieve informations about the user logged in
                    const userResponse = await fetch("https://api.intra.42.fr/v2/me", {
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
                    });
                    if (!userResponse.ok)
                        throw new Error(`HTTP error! status: ${response.status}`);
                    const userData = await userResponse.json();
                    const payload = { sub: userData.id, username: userData.login };
                    await this.UserService.createUser({ userName: userData.login, image: userData.image.link });
                    const access_token = await this.JwtService.signAsync(payload);
                    res.cookie('jwt_token', access_token, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'lax',
                        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
                    }).send({ status: 'ok'});
                }
            }
        }
        catch(error){
            console.log(error);
        }
    }
}
