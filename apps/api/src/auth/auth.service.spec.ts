import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let users: UsersService;
  let jwt: JwtService;
  let service: AuthService;

  beforeEach(async () => {
    users = new UsersService();
    jwt = new JwtService({ secret: 'test-secret' });
    service = new AuthService(users, jwt);
    await users.create({
      name: 'Maria',
      email: 'maria@example.com',
      password: 'senha1234',
    });
  });

  it('returns a token whose subject is the user id', async () => {
    const { accessToken } = await service.login({
      email: 'MARIA@example.com',
      password: 'senha1234',
    });
    const payload = await jwt.verifyAsync(accessToken);
    expect(payload.sub).toBe(users.findByEmail('maria@example.com')!.id);
  });

  it('rejects a wrong password', async () => {
    await expect(
      service.login({ email: 'maria@example.com', password: 'wrong' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an unknown email', async () => {
    await expect(
      service.login({ email: 'nobody@example.com', password: 'senha1234' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
