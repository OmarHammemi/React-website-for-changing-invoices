import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { Connection } from 'typeorm';
import { TENANT_CONNECTION } from '../tenant/tenant.module';
import { UserRep } from '../domain/user/user.interface';
import { CreateUserDomain } from '../domain/user/create.user.domain';
import { UpdateUserDomain } from '../domain/user/update.user.domain';

@Controller('users')
export class UserController {

  constructor(private readonly configService: ConfigService,
              private readonly userService: UserService,
              @Inject(TENANT_CONNECTION) private connection: Connection) {
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findMember(@Param('id', ParseIntPipe) memberId): Promise<UserRep> {
    return await this.userService.findOneById(this.connection, memberId);
  }

  @Get('operations/current-member')
  @HttpCode(HttpStatus.OK)
  async findCurrentMember(@Request() req): Promise<UserRep> {
    return await this.userService.findOneById(this.connection, req.user.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllMember(@Query('activeFilter') activeFilter): Promise<UserRep[]> {
    return await this.userService.findAll(this.connection, activeFilter);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createMember(@Body() payload: CreateUserDomain): Promise<UserRep> {
    return await this.userService.createUser(this.connection, payload);
  }

  @Put(':id/update')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateMember(@Param('id', ParseIntPipe) memberId,
                     @Body() memberDto: UpdateUserDomain): Promise<UserRep> {
    return await this.userService.updateUser(this.connection, memberId, memberDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(@Param('id', ParseIntPipe) memberId): Promise<Record<string, unknown>> {
    await this.userService.changeUserActive(this.connection, memberId, false);
    return { message: 'Deleted successfully' }
  }
}
