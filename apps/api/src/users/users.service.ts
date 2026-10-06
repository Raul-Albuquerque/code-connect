import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { hashPassword } from '../common/password.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { User } from './user.entity.js';

@Injectable()
export class UsersService {
  private readonly users = new Map<string, User>();

  async create({ name, email, password }: CreateUserDto): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();
    if (this.findByEmail(normalizedEmail)) {
      throw new ConflictException('Email already registered');
    }

    const user: User = {
      id: randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await hashPassword(password),
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  findByEmail(email: string): User | undefined {
    const normalizedEmail = email.trim().toLowerCase();
    return [...this.users.values()].find((u) => u.email === normalizedEmail);
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }
}
