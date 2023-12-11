import { Injectable } from '@nestjs/common';
import { AbstractHashingService } from './abstract-hashing-service';
import { hash, compare } from 'bcrypt';

@Injectable()
export class BcryptHashingService extends AbstractHashingService {
  async hash(password: string): Promise<string> {
    return hash(password, 12);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return compare(password, hash).catch(() => false);
  }
}
