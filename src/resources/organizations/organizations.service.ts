import { Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from './repositories/organization/organization.repository';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async findOneOrFail(id: number) {
    return await this.organizationRepository.findOneByOrFail(
      { id },
      new NotFoundException('Organization not found'),
    );
  }

  async findAll() {
    return await this.organizationRepository.find();
  }

  async create(data: CreateOrganizationDto) {
    return await this.organizationRepository.insert(data);
  }

  async update(id: number, data: UpdateOrganizationDto) {
    return await this.organizationRepository.update(
      id,
      data,
      new NotFoundException('Organization not found'),
    );
  }

  async delete(id: number) {
    return await this.organizationRepository.delete(
      id,
      new NotFoundException('Organization not found'),
    );
  }
}
