import { ApiProperty } from '@nestjs/swagger';
import type { User } from '../user.entity.js';

export class UserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Maria Silva' })
  name: string;

  @ApiProperty({ example: 'maria@example.com' })
  email: string;

  @ApiProperty({ format: 'date-time' })
  createdAt: Date;

  static from(user: User): UserResponseDto {
    const { id, name, email, createdAt } = user;
    return { id, name, email, createdAt };
  }
}
