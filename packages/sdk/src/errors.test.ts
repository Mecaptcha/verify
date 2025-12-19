import { describe, it, expect } from 'vitest';
import {
  MeCaptchaError,
  InvalidApiKeyError,
  InvalidCodeError,
  InvalidPhoneError,
  RateLimitError,
  NetworkError,
  ServerError,
} from './errors';

describe('Error Classes', () => {
  describe('MeCaptchaError', () => {
    it('should create error with message and code', () => {
      const error = new MeCaptchaError('Test error', 'TEST_CODE');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('MeCaptchaError');
    });

    it('should include statusCode when provided', () => {
      const error = new MeCaptchaError('Test error', 'TEST_CODE', 400);
      expect(error.statusCode).toBe(400);
    });
  });

  describe('InvalidApiKeyError', () => {
    it('should create error with correct properties', () => {
      const error = new InvalidApiKeyError('Invalid API key');
      expect(error.message).toBe('Invalid API key');
      expect(error.code).toBe('INVALID_API_KEY');
      expect(error.statusCode).toBe(401);
      expect(error.name).toBe('InvalidApiKeyError');
    });

    it('should use default message when not provided', () => {
      const error = new InvalidApiKeyError();
      expect(error.message).toBe('Invalid API key');
    });
  });

  describe('InvalidCodeError', () => {
    it('should create error with correct properties', () => {
      const error = new InvalidCodeError('Invalid code');
      expect(error.message).toBe('Invalid code');
      expect(error.code).toBe('INVALID_CODE');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('InvalidCodeError');
    });

    it('should use default message when not provided', () => {
      const error = new InvalidCodeError();
      expect(error.message).toBe('Invalid verification code');
    });
  });

  describe('InvalidPhoneError', () => {
    it('should create error with correct properties', () => {
      const error = new InvalidPhoneError('Invalid phone');
      expect(error.message).toBe('Invalid phone');
      expect(error.code).toBe('INVALID_PHONE');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('InvalidPhoneError');
    });

    it('should use default message when not provided', () => {
      const error = new InvalidPhoneError();
      expect(error.message).toBe('Invalid phone number');
    });
  });

  describe('RateLimitError', () => {
    it('should create error with correct properties', () => {
      const error = new RateLimitError('Rate limit exceeded');
      expect(error.message).toBe('Rate limit exceeded');
      expect(error.code).toBe('RATE_LIMIT');
      expect(error.statusCode).toBe(429);
      expect(error.name).toBe('RateLimitError');
    });

    it('should use default message when not provided', () => {
      const error = new RateLimitError();
      expect(error.message).toBe('Rate limit exceeded');
    });
  });

  describe('NetworkError', () => {
    it('should create error with correct properties', () => {
      const error = new NetworkError('Network failed');
      expect(error.message).toBe('Network failed');
      expect(error.code).toBe('NETWORK_ERROR');
      expect(error.statusCode).toBeUndefined();
      expect(error.name).toBe('NetworkError');
    });

    it('should use default message when not provided', () => {
      const error = new NetworkError();
      expect(error.message).toBe('Network request failed');
    });
  });

  describe('ServerError', () => {
    it('should create error with correct properties', () => {
      const error = new ServerError('Server error');
      expect(error.message).toBe('Server error');
      expect(error.code).toBe('SERVER_ERROR');
      expect(error.statusCode).toBe(500);
      expect(error.name).toBe('ServerError');
    });

    it('should use default message when not provided', () => {
      const error = new ServerError();
      expect(error.message).toBe('Server error');
    });
  });
});

