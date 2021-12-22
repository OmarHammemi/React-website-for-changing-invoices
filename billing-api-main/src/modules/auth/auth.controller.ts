import { Controller, Body, Post, UseGuards, Get, Request, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDomain } from '../domain/auth/login.domain';
import { TokenDomain } from '../domain/auth/token.domain';
import { Connection } from 'typeorm';
import { TENANT_CONNECTION } from '../tenant/tenant.module';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('authentication')
export class AuthController {

  constructor(private readonly authenticationService: AuthService,
              @Inject(TENANT_CONNECTION) private connection: Connection) {
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLoggedInUser(@Request() request) {
    return Object.assign(request.user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginPayload: LoginDomain): Promise<TokenDomain> {
    const { email, password } = loginPayload;
    const authedUser = await this.authenticationService.loginUser(this.connection, email, password);
    return await this.authenticationService.createToken(this.connection, authedUser);
  }
}
