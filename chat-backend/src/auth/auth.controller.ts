import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignInDto } from './dtos';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('/signup')
    signup(@Body() dto: AuthDto): Promise<Tokens> {
       return this.authService.signup(dto);
    }

    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() dto: SignInDto): Promise<Tokens> {
       return this.authService.signin(dto);
    }

    @Post('/logout')
    logout() {
      return this.authService.logout();
    }

    @Post('/refresh')
    refreshTokens () {
       return this.authService.refreshTokens();
    }
}
