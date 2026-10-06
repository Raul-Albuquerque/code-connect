import { hashPassword, verifyPassword } from './password.js';

describe('password', () => {
  it('hashes without exposing the plain password', async () => {
    const hash = await hashPassword('secret-123');
    expect(hash).not.toContain('secret-123');
  });

  it('uses a different salt on every hash', async () => {
    expect(await hashPassword('secret-123')).not.toBe(
      await hashPassword('secret-123'),
    );
  });

  it('verifies the correct password', async () => {
    const hash = await hashPassword('secret-123');
    expect(await verifyPassword('secret-123', hash)).toBe(true);
  });

  it('rejects a wrong password or malformed hash', async () => {
    const hash = await hashPassword('secret-123');
    expect(await verifyPassword('other', hash)).toBe(false);
    expect(await verifyPassword('secret-123', 'garbage')).toBe(false);
  });
});
