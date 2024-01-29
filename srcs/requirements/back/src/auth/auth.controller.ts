import { Controller,  Get, Query, Res, SetMetadata } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {  Response } from 'express';

dotenv.config();

@Controller('auth')
export class AuthController {
    constructor(
        private readonly UserService: UserService,
        private readonly JwtService: JwtService){}

    @Get('login')
    @SetMetadata('isPublic', true)
    async makeAuth42(@Query('code') code: string, @Res() res: Response) : Promise<any>{
        try {
            if (code) {
                console.log("redirect uri: ", process.env.VITE_REDIRECT_URI);
                //Fetch to retrieve the bearer token with query code
                try{
                    var response = await fetch("https://api.intra.42.fr/oauth/token", {
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
                }
                catch(error){
                    console.log(error)
                }

                const data = await response.json();
                const token = data.access_token;

                if (token){
                    //Fetch to retrieve informations about the user logged in
                    try{
                        var userResponse = await fetch("https://api.intra.42.fr/v2/me", {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        if (!userResponse.ok)
                            throw (new Error(`HTTP error! status: ${userResponse.status}`));
                    }
                    catch(error){
                        console.log(error)
                    }

                    const userData = await userResponse.json();
                    const payload = { sub: userData.id, username: userData.login };

                    var user = await this.UserService.getUserByDisplayName(userData.login);
                    if (user){
                        //If user already exist we set the cookies back and set its status to "online"
                        const access_token = await this.JwtService.signAsync(payload);
                        this.setCookie(res, user.userId, access_token);
                        if (user.A2F)
                            res.redirect("https://1b1.42angouleme.fr:1505/2fa");
                        else{
                            this.UserService.setStatus(user.userName, "online");
                            res.redirect("https://1b1.42angouleme.fr:1505/settings");
                        }
                        return ;
                    }
                    const newUser = await this.UserService.createUser({ userName: userData.login, image: userData.image.link });
                    const access_token = await this.JwtService.signAsync(payload);
                    this.UserService.setStatus(newUser.userName, "online");
                    this.setCookie(res, newUser.userId, access_token);
                    res.redirect("https://1b1.42angouleme.fr:1505/settings");
                }
            }
        }
        catch(error){
            throw error;
        }
    }

    private setCookie(res: Response, userId: number, bearerToken: string){
        //Jwt token to make request to the back
        res.cookie('Bearer', bearerToken, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        });
        //UserId to retrieve user in db
        res.cookie('UserId', userId, {
            httpOnly: false,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        })
    }
}
