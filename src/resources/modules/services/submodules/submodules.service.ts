import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubmoduleRepository } from '../../repositories/submodule/submodule.repository';
import { CreateSubmoduleDto } from '../../dto/create-submodule.dto';
import { UpdateSubmoduleDto } from '../../dto/update-submodule.dto';

@Injectable()
export class SubmodulesService {
  constructor(private readonly submoduleRepository: SubmoduleRepository) {}

  async getSubmodulesByModule(moduleId: number, lock?: boolean) {
    return this.submoduleRepository.find({
      where: {
        module: { id: moduleId },
      },
      ...(lock && { lock: { mode: 'pessimistic_write' } }),
    });
  }

  async getSubmodule(id: number) {
    return this.submoduleRepository.findOne({
      where: { id },
      relations: {
        quiz: true,
        slides: true,
        module: true,
      },
    });
  }

  async createSubmodule(data: CreateSubmoduleDto) {
    const isValid = await this.validateSubmoduleNumber(
      data.moduleId,
      data.number,
    );
    if (!isValid) {
      throw new BadRequestException('Invalid submodule number');
    }
    await this.submoduleRepository.fixSubmoduleNumbersForInsertion(
      data.moduleId,
      data.number,
    );
    return await this.submoduleRepository.createAndReturn(data);
  }

  async updateSubmodule(id: number, data: UpdateSubmoduleDto) {
    const submodule = await this.getSubmodule(id);
    if (!submodule) {
      throw new NotFoundException('Submodule not found');
    }
    const { quizId, title } = data;
    await this.submoduleRepository.update(id, {
      quiz: { id: quizId },
      title,
    });
  }

  async deleteSubmodule(id: number) {
    const submodule = await this.getSubmodule(id);
    if (!submodule) {
      throw new NotFoundException('Submodule not found');
    }
    await this.submoduleRepository.fixSubmoduleNumbersForDeletion(
      submodule.module.id,
      submodule.number,
    );
    await this.submoduleRepository.delete(id);
  }

  async validateSubmoduleNumber(
    moduleId: number,
    number: number,
  ): Promise<boolean> {
    const submodules = await this.getSubmodulesByModule(moduleId, true);
    if (submodules.length === 0) {
      return number === 1;
    } else {
      return number > 0 && number <= submodules.length + 1;
    }
  }
}
