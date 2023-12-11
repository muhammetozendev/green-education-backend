import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../repositories/user/user.repository';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.insert({
      name: createUserDto.name,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: createUserDto.password,
      role: createUserDto.role,
    });
  }

  async update(id: number, UpdateUserDto: UpdateUserDto) {
    return await this.userRepository.updateAndReturn(id, UpdateUserDto);
  }

  async delete(id: number) {
    return await this.userRepository.delete(id);
  }
}
