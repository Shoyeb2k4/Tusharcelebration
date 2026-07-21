import { describe, expect, it } from 'vitest';
import { customerSchema, customerFilterSchema } from './schema';

describe('customerSchema', () => {
  it('accepts a valid customer', () => {
    const r = customerSchema.safeParse({
      name: 'Sharma Family',
      phone: '+91 98200 11111',
      email: 'sharma@email.com',
    });
    expect(r.success).toBe(true);
  });

  it('rejects a short name', () => {
    const r = customerSchema.safeParse({ name: 'A', phone: '9820011111' });
    expect(r.success).toBe(false);
  });

  it('rejects an invalid phone', () => {
    const r = customerSchema.safeParse({ name: 'Valid Name', phone: 'abc' });
    expect(r.success).toBe(false);
  });

  it('allows an empty optional email', () => {
    const r = customerSchema.safeParse({
      name: 'Valid Name',
      phone: '9820011111',
      email: '',
    });
    expect(r.success).toBe(true);
  });
});

describe('customerFilterSchema', () => {
  it('defaults the page size to 25', () => {
    const r = customerFilterSchema.parse({});
    expect(r.limit).toBe(25);
  });

  it('caps the page size at 100', () => {
    const r = customerFilterSchema.safeParse({ limit: 500 });
    expect(r.success).toBe(false);
  });
});
