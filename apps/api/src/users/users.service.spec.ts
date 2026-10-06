import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  let service: UsersService;
  const dto = {
    name: 'Maria',
    email: 'Maria@Example.com',
    password: 'senha1234',
  };

  beforeEach(() => {
    service = new UsersService();
  });

  it('creates a user with normalized email and hashed password', async () => {
    const user = await service.create(dto);
    expect(user.email).toBe('maria@example.com');
    expect(user.passwordHash).not.toContain(dto.password);
    expect(service.findById(user.id)).toBe(user);
  });

  it('rejects a duplicated email regardless of case', async () => {
    await service.create(dto);
    await expect(
      service.create({ ...dto, email: 'MARIA@example.com' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('finds users by email case-insensitively', async () => {
    const user = await service.create(dto);
    expect(service.findByEmail('MARIA@EXAMPLE.COM')).toBe(user);
    expect(service.findByEmail('nobody@example.com')).toBeUndefined();
  });
});
