import { Connection, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Tenant } from '../tenant/tenant.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {

  constructor(private configService: ConfigService,
              private connection: Connection) {
  }

  public async findAllTenants(): Promise<Tenant[]> {
    const repository: Repository<Tenant> = await this.connection.getRepository(Tenant);
    return await repository.find();
  }
}
