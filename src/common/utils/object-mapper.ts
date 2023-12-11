import { ClassConstructor, plainToInstance } from 'class-transformer';

export function mapObject<T>(
  cls: ClassConstructor<T>,
  obj: unknown | unknown[],
): T {
  return plainToInstance(cls, obj, {
    excludeExtraneousValues: true,
  });
}
