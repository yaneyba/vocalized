import { describe, it, expect, beforeEach } from 'vitest';
import app from '@/index';
import { createMockEnv, seedTestData } from '../helpers/mock-env';
import type { Env } from '@/types/env';
import type { LoginResponse, ErrorResponse, SuccessResponse } from '../helpers/test-types';

describe('Client Authentication', () => {
  let env: Env;

  beforeEach(() => {
    env = createMockEnv();
    seedTestData(env);
  });

  describe('POST /auth/signup', () => {
    it('should signup successfully with valid data', async () => {
      const res = await app.request(
        '/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'newuser@test.com',
            password: 'securepassword123',
            name: 'New User',
          }),
        },
        env
      );

      expect(res.status).toBe(201);
      const data = await res.json() as LoginResponse;
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('refresh_token');
      expect(data.user).toMatchObject({
        email: 'newuser@test.com',
        name: 'New User',
      });
    });

    it('should fail with weak password', async () => {
      const res = await app.request(
        '/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'newuser@test.com',
            password: 'weak',
            name: 'New User',
          }),
        },
        env
      );

      expect(res.status).toBe(400);
      const data = await res.json() as ErrorResponse;
      expect(data.error).toBe('Validation Error');
      expect(data.message).toContain('8 characters');
    });

    it('should fail with missing fields', async () => {
      const res = await app.request(
        '/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'newuser@test.com',
          }),
        },
        env
      );

      expect(res.status).toBe(400);
      const data = await res.json() as ErrorResponse;
      expect(data.error).toBe('Validation Error');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await app.request(
        '/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'user@test.com',
            password: 'password',
          }),
        },
        env
      );

      expect(res.status).toBe(200);
      const data = await res.json() as LoginResponse;
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('refresh_token');
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('workspaces');
      expect(data.user.email).toBe('user@test.com');
    });

    it('should fail with invalid credentials', async () => {
      const res = await app.request(
        '/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'user@test.com',
            password: 'wrongpassword',
          }),
        },
        env
      );

      expect(res.status).toBe(401);
      const data = await res.json() as ErrorResponse;
      expect(data.error).toBe('Authentication Failed');
    });

    it('should fail with non-existent user', async () => {
      const res = await app.request(
        '/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'nonexistent@test.com',
            password: 'password',
          }),
        },
        env
      );

      expect(res.status).toBe(401);
      const data = await res.json() as ErrorResponse;
      expect(data.error).toBe('Authentication Failed');
    });
  });

  describe('GET /auth/me', () => {
    it('should return current user with workspaces', async () => {
      // First login
      const loginRes = await app.request(
        '/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'user@test.com',
            password: 'password',
          }),
        },
        env
      );

      const { token } = await loginRes.json() as LoginResponse;

      // Then get user details
      const res = await app.request(
        '/auth/me',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        env
      );

      expect(res.status).toBe(200);
      const data = await res.json() as LoginResponse;
      expect(data).toHaveProperty('user');
      expect(data).toHaveProperty('workspaces');
      expect(data.user.email).toBe('user@test.com');
      expect(Array.isArray(data.workspaces)).toBe(true);
    });

    it('should fail without authorization', async () => {
      const res = await app.request('/auth/me', { method: 'GET' }, env);

      expect(res.status).toBe(401);
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      // First login
      const loginRes = await app.request(
        '/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'user@test.com',
            password: 'password',
          }),
        },
        env
      );

      const { token } = await loginRes.json() as LoginResponse;

      // Then logout
      const res = await app.request(
        '/auth/logout',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        env
      );

      expect(res.status).toBe(200);
      const data = await res.json() as SuccessResponse;
      expect(data.message).toBe('Logged out successfully');
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should send reset email for existing user', async () => {
      const res = await app.request(
        '/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'user@test.com',
          }),
        },
        env
      );

      expect(res.status).toBe(200);
      const data = await res.json() as SuccessResponse;
      expect(data.message).toContain('password reset link');
    });

    it('should return same response for non-existent user (security)', async () => {
      const res = await app.request(
        '/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'nonexistent@test.com',
          }),
        },
        env
      );

      expect(res.status).toBe(200);
      const data = await res.json() as SuccessResponse;
      expect(data.message).toContain('password reset link');
    });

    it('should fail with missing email', async () => {
      const res = await app.request(
        '/auth/forgot-password',
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
    });
  });

  describe('POST /auth/reset-password', () => {
    it('should fail with weak password', async () => {
      const res = await app.request(
        '/auth/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: 'some-reset-token',
            new_password: 'weak',
          }),
        },
        env
      );

      expect(res.status).toBe(400);
      const data = await res.json() as ErrorResponse;
      expect(data.message).toContain('8 characters');
    });

    it('should fail with missing fields', async () => {
      const res = await app.request(
        '/auth/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: 'some-token',
          }),
        },
        env
      );

      expect(res.status).toBe(400);
    });
  });
});
