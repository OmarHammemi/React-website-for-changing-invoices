import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { DictionaryView } from './dictionary.view';
import { Dictionary } from './dictionary.entity';
import { DictionaryRep } from '../domain/dictionary/dictionary.interface';
import { UpdateDictionaryDomain } from '../domain/dictionary/update.dictionary.domain';

@Injectable()
export class DictionaryService {

  public async findAll(connection: Connection): Promise<DictionaryRep[]> {
    try {
      const repository: Repository<DictionaryView> = await connection.getRepository(DictionaryView);
      return await repository.find();
    } catch (error) {
      return [];
    }
  }

  public async findAllByType(connection: Connection, dictionaryType: string): Promise<DictionaryRep[]> {
    try {
      const repository: Repository<DictionaryView> = await connection.getRepository(DictionaryView);
      return await repository.find({
        where: { dictionary: dictionaryType },
      });
    } catch (error) {
      return [];
    }
  }

  public async createOrUpdate(connection: Connection, dictionaryDomain: UpdateDictionaryDomain): Promise<DictionaryRep> {
    try {
      const repository: Repository<Dictionary> = await connection.getRepository(Dictionary);

      let dictionary;

      if (dictionaryDomain.id != null) {
        dictionary = await repository.findOne(dictionaryDomain.id);
        dictionary = {
          ...dictionary,
          ...dictionaryDomain,
          updatedAt: new Date(),
          updatedBy: 0,
        }

      } else {
        dictionary = {
          ...dictionaryDomain,
          createdAt: new Date(),
          createdBy: 0
        }
      }

      return await repository.save(dictionary);
    } catch (error) {
      throw new HttpException({ error: error, message: 'Error saving dictionary'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async delete(connection: Connection, id: number): Promise<void> {
    try {
      const repository: Repository<DictionaryView> = await connection.getRepository(DictionaryView);

      await repository.delete({ id });
    } catch (error) {
      throw new HttpException({ error: error, message: 'Error deleting dictionary'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async findById(connection: Connection, id: number): Promise<DictionaryRep> {
    try {
      const repository: Repository<DictionaryView> = await connection.getRepository(DictionaryView);
      const dictionary = await repository.findOne({
        where: { id },
      }) as DictionaryRep;

      if(dictionary.data) {
        dictionary.dataJSON = JSON.parse(dictionary.data);
      }

      return dictionary;
    } catch (error) {
      return null;
    }
  }

  public async findCountryFrance(connection: Connection): Promise<DictionaryRep> {
    try {
      const repository: Repository<DictionaryView> = await connection.getRepository(DictionaryView);
      return await repository.findOne({where: { code: 'FRA', dictionary: 'COUNTRY_CODE' }});
    } catch (error) {
      return null;
    }
  }

  public async findCivilityMister(connection: Connection): Promise<DictionaryRep> {
    try {
      const repository: Repository<DictionaryView> = await connection.getRepository(DictionaryView);
      return await repository.findOne({where: { code: 'MR' }});
    } catch (error) {
      return null;
    }
  }

  public async findPhoneType(connection: Connection): Promise<DictionaryRep> {
    try {
      const repository: Repository<DictionaryView> = await connection.getRepository(DictionaryView);
      return await repository.findOne({where: { code: 'TELEPHONE' }});
    } catch (error) {
      return null;
    }
  }

  public async findEmailType(connection: Connection): Promise<DictionaryRep> {
    try {
      const repository: Repository<DictionaryView> = await connection.getRepository(DictionaryView);
      return await repository.findOne({where: { code: 'MAIL' }});
    } catch (error) {
      return null;
    }
  }
}
