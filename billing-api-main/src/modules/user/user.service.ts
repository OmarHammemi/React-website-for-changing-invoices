import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, DeleteResult, Repository } from 'typeorm';
import { Logger } from "nestjs-pino";
import { UserView } from './user.view';
import { User } from './user.entity';
import * as argon2 from 'argon2';
import { validate } from 'class-validator';
import { CreateUserDomain } from '../domain/user/create.user.domain';
import { UpdateUserDomain } from '../domain/user/update.user.domain';
import { DictionaryView } from '../dictionary/dictionary.view';

@Injectable()
export class UserService {
  constructor(private configService: ConfigService,
              private readonly logger: Logger) {
  }

  public async findOneById(connection: Connection, id: number): Promise<UserView> {
    try {
      const repository: Repository<UserView> = await connection.getRepository(UserView);
      return await repository.findOneOrFail(id);
    } catch (error) {
      throw new HttpException({ error: 'User Read', message: 'User not found' }, HttpStatus.NOT_FOUND);
    }
  }

  public async findOneByEmail(connection: Connection, email: string): Promise<UserView> {
    try {
      const repository: Repository<UserView> = await connection.getRepository(UserView);
      return await repository.findOneOrFail({ email });
    } catch (error) {
      throw new HttpException({ error: 'User Read', message: 'User not found' }, HttpStatus.NOT_FOUND);
    }
  }

  public async findAll(connection: Connection, activeFilter: string): Promise<UserView[]> {
    try {
      const active = activeFilter !== 'false';
      let queryBuilder = await connection.getRepository(UserView).createQueryBuilder('m');

      queryBuilder.leftJoinAndMapOne('m.civility', DictionaryView, 'd', 'm.title = d.id');

      if (active) {
        queryBuilder = queryBuilder.where('m.active = :active', { active });
      }

      return queryBuilder.getMany();
    } catch (error) {
      throw new HttpException({ error: error, message: 'User not found' }, HttpStatus.NOT_FOUND);
    }
  }

  public async createUser(connection: Connection, userDomain: CreateUserDomain): Promise<User> {
    const repository: Repository<User> = await connection.getRepository(User);
    const repositoryQuery: Repository<UserView> = await connection.getRepository(UserView);

    const { email, password } = userDomain;
    const qb = await repositoryQuery
      .createQueryBuilder('Users')
      .where('Users.email = :email', { email });

    const existedUser = await qb.getOne();

    if (existedUser) {
      const _errors = { email: 'Email must be unique.' };
      throw new HttpException({ message: 'Input data validation failed', _errors }, HttpStatus.BAD_REQUEST);
    }

    const toCreate = repository.create(userDomain);
    delete toCreate.password;

    const errors = await validate(toCreate);
    if (errors.length > 0) {
      const _errors = { User: 'User input is not valid.' };
      throw new HttpException({ message: 'Input data validation failed', _errors }, HttpStatus.BAD_REQUEST);
    }

    try {
      toCreate.password = await argon2.hash(password);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    try {
      this.logger.log(`Creating new User with email ${toCreate.email}`);
      return await repository.save(toCreate);
    } catch (errors) {
      throw new HttpException({ message: errors, error: 'User Creation' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async updateUser(connection: Connection, UserId: number, userDomain: UpdateUserDomain): Promise<User> {
    const repository: Repository<User> = await connection.getRepository(User);

    const user = await repository.findOne({
      where: { id: UserId },
    });

    if (!user) {
      throw new HttpException('User id does not exist', HttpStatus.NOT_FOUND);
    }
    const toUpdate = Object.assign(user, userDomain);
    try {
      return await repository.save(toUpdate);
    } catch (errors) {
      throw new HttpException({ message: errors, error: 'Database Update' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  public async changeUserActive(connection: Connection, UserId: number, active: boolean): Promise<void> {
    const repository: Repository<User> = await connection.getRepository(User);
    const user = await repository.findOne({
      where: { id: UserId },
    });

    if (!user) {
      throw new HttpException(
        'User id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      await repository.save({ ...user, active: active });
    } catch (errors) {
      throw new HttpException({
        message: errors,
        error: 'Can\'t delete the User',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async deleteUser(connection: Connection, UserId: number): Promise<DeleteResult> {
    const repository: Repository<User> = await connection.getRepository(User);
    const user = await repository.findOne({
      where: { id: UserId },
    });
    if (!user) {
      throw new HttpException('User id does not exist', HttpStatus.NOT_FOUND);
    }
    try {
      return await repository.delete(user);
    } catch (errors) {
      throw new HttpException({ message: errors, error: 'User Delete' }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async saveUser(connection: Connection, User: User): Promise<User> {
    try {
      const repository: Repository<UserView> = await connection.getRepository(UserView);
      return await repository.save(User);
    } catch (error) {
      throw new HttpException({
        error: 'User Save',
        message: 'Cannot save User',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
