import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard.js';

function contextWith(request: object): ExecutionContext {
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('AuthGuard', () => {
  const jwtService = new JwtService({ secret: 'test-secret' });
  const guard = new AuthGuard(jwtService);

  it('rejects requests without a token', async () => {
    await expect(
      guard.canActivate(contextWith({ headers: {} })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects a non-Bearer scheme', async () => {
    const token = await jwtService.signAsync({ sub: '1' });
    await expect(
      guard.canActivate(
        contextWith({ headers: { authorization: `Basic ${token}` } }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an invalid token', async () => {
    await expect(
      guard.canActivate(
        contextWith({ headers: { authorization: 'Bearer nope' } }),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('accepts a valid token and attaches the payload', async () => {
    const token = await jwtService.signAsync({ sub: '1', email: 'a@b.co' });
    const request: Record<string, any> = {
      headers: { authorization: `Bearer ${token}` },
    };
    await expect(guard.canActivate(contextWith(request))).resolves.toBe(true);
    expect(request.user).toMatchObject({ sub: '1', email: 'a@b.co' });
  });
});
