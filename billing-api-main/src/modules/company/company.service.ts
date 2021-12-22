import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Connection } from 'typeorm';
import { Observable, from, throwError } from 'rxjs';
import { Company } from './company.entity';
import { CompanyRep } from '../domain/company/company.interface';
import { CompanyView } from './company.view';
import { UpdateCompanyDomain } from '../domain/company/update.company.domain';


@Injectable()
export class CompanyService {
  public async findAll(connection: Connection): Promise<CompanyRep[]> {
    try {
      const repository: Repository<CompanyView> = await connection.getRepository(CompanyView);
      return await repository.find();
    } catch (error) {
      return [];
    }
  }


  public async createOrUpdate(connection: Connection, companyDomain: UpdateCompanyDomain): Promise<CompanyRep> {
    try {
      const repository: Repository<Company> = await connection.getRepository(Company);

      let company;

      if (companyDomain.id != null) {
        company = await repository.findOne(companyDomain.id);
        company = {
          ...company,
          ...companyDomain,
          updatedAt: new Date(),
          updatedBy: 0,
        }

      } else {
        company = {
          ...companyDomain,
          createdAt: new Date(),
          createdBy: 0
        }
      }

      return await repository.save(company);
    } catch (error) {
      throw new HttpException({ error: error, message: 'Error saving company'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async delete(connection: Connection, id: number): Promise<void> {
    try {
      const repository: Repository<CompanyView> = await connection.getRepository(CompanyView);

      await repository.delete({ id });
    } catch (error) {
      throw new HttpException({ error: error, message: 'Error deleting company'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findOneById(connection: Connection, id: number): Promise<CompanyView> {
    try {
      const repository: Repository<CompanyView> = await connection.getRepository(CompanyView);
      return await repository.findOneOrFail(id);
    } catch (error) {
      throw new HttpException({ error: 'Company Read', message: 'company not found' }, HttpStatus.NOT_FOUND);
    }
  }


}
