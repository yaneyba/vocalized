import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/index';
import { createMockEnv, seedTestData } from '../helpers/mock-env';
import type { Env } from '../../src/types/env';

describe('Admin Authentication', () => {
  let env: Env;

  beforeEach(() => {
    env = createMockEnv();
    seedTestData(env);
  });

  describe('POST /admin/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await app.request(
        '/admin/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'admin@vocalized.test',
            password: 'password',
          }),
        },
        env
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('refresh_token');
      expect(data.admin).toEqual({
        id: 'admin-1',
        email: 'admin@vocalized.test',
        name: 'Test Admin',
        role: 'super_admin',
      });
    });

    it('should fail with invalid email', async () => {
      const res = await app.request(
        '/admin/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'wrong@email.com',
            password: 'password',
          }),
        },
        env
      );

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Authentication Failed');
    });

    it('should fail with invalid password', async () => {
      const res = await app.request(
        '/admin/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'admin@vocalized.test',
            password: 'wrongpassword',
          }),
        },
        env
      );

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Authentication Failed');
    });

    it('should fail with missing credentials', async () => {
      const res = await app.request(
        '/admin/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        },
        env
      );

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Validation Error');
    });
  });

  describe('GET /admin/auth/me', () => {
    it('should return current admin with valid token', async () => {
      // First login to get token
      const loginRes = await app.request(
        '/admin/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'admin@vocalized.test',
            password: 'password',
          }),
        },
        env
      );

      const { token } = await loginRes.json();

      // Then get admin details
      const res = await app.request(
        '/admin/auth/me',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        env
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.admin).toHaveProperty('id');
      expect(data.admin).toHaveProperty('email');
      expect(data.admin).toHaveProperty('name');
      expect(data.admin).toHaveProperty('role');
    });

    it('should fail without authorization header', async () => {
      const res = await app.request('/admin/auth/me', { method: 'GET' }, env);

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should fail with invalid token', async () => {
      const res = await app.request(
        '/admin/auth/me',
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer invalid-token',
          },
        },
        env
      );

      expect(res.status).toBe(401);
      const data = await res.json();
      expect(data.error).toBe('Unauthorized');
    });
  });

  describe('POST /admin/auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      // First login
      const loginRes = await app.request(
        '/admin/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'admin@vocalized.test',
            password: 'password',
          }),
        },
        env
      );

      const { token } = await loginRes.json();

      // Then logout
      const res = await app.request(
        '/admin/auth/logout',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        env
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.message).toBe('Logged out successfully');
    });

    it('should fail without authorization', async () => {
      const res = await app.request(
        '/admin/auth/logout',
        { method: 'POST' },
        env
      );

      expect(res.status).toBe(401);
    });
  });

  describe('POST /admin/auth/refresh', () => {
    it('should refresh token with valid refresh token', async () => {
      // First login to get refresh token
      const loginRes = await app.request(
        '/admin/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'admin@vocalized.test',
            password: 'password',
          }),
        },
        env
      );

      const { refresh_token } = await loginRes.json();

      // Then refresh
      const res = await app.request(
        '/admin/auth/refresh',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh_token,
          }),
        },
        env
      );

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty('token');
      expect(data.admin).toHaveProperty('id');
    });

    it('should fail with missing refresh token', async () => {
      const res = await app.request(
        '/admin/auth/refresh',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        },
        env
      );

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe('Validation Error');
    });
  });
});
