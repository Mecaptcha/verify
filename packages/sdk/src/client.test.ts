import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios, { AxiosError } from 'axios';
import { MeCaptchaClient } from './client';
import {
  InvalidApiKeyError,
  InvalidCodeError,
  InvalidPhoneError,
  RateLimitError,
  NetworkError,
  ServerError,
} from './errors';

vi.mock('axios');

const TEST_API_KEY = 'mec_test_abc123';
const TEST_PHONE = '+15551234567';
const TEST_CODE = '123456';

describe('MeCaptchaClient', () => {
  let client: MeCaptchaClient;
  let mockPost: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPost = vi.fn();
    (axios.create as ReturnType<typeof vi.fn>).mockReturnValue({
      post: mockPost,
    } as unknown as ReturnType<typeof axios.create>);
    client = new MeCaptchaClient(TEST_API_KEY);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create client with valid API key', () => {
      expect(() => new MeCaptchaClient('mec_live_test123')).not.toThrow();
      expect(() => new MeCaptchaClient('mec_test_abc123')).not.toThrow();
      expect(() => new MeCaptchaClient('demo')).not.toThrow();
    });

    it('should throw error for empty API key', () => {
      expect(() => new MeCaptchaClient('')).toThrow('API key is required');
    });

    it('should throw error for invalid API key format', () => {
      expect(() => new MeCaptchaClient('invalid_key')).toThrow(
        'API key must be "demo" or start with "mec_live_" or "mec_test_"',
      );
    });

    it('should use custom baseUrl when provided', () => {
      const customUrl = 'https://custom-api.example.com';
      const customClient = new MeCaptchaClient(TEST_API_KEY, {
        baseUrl: customUrl,
      });
      expect(customClient).toBeDefined();
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: customUrl,
        }),
      );
    });

    it('should use default baseUrl when not provided', () => {
      const client = new MeCaptchaClient(TEST_API_KEY);
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://api.mecaptcha.com/v1',
        }),
      );
    });

    it('should use MECAPTCHA_BASE_URL environment variable when available', () => {
      const originalEnv = process.env.MECAPTCHA_BASE_URL;
      process.env.MECAPTCHA_BASE_URL = 'https://env-api.example.com';

      const client = new MeCaptchaClient(TEST_API_KEY);
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://env-api.example.com',
        }),
      );

      process.env.MECAPTCHA_BASE_URL = originalEnv;
    });

    it('should prioritize options.baseUrl over environment variable', () => {
      const originalEnv = process.env.MECAPTCHA_BASE_URL;
      process.env.MECAPTCHA_BASE_URL = 'https://env-api.example.com';

      const customUrl = 'https://options-api.example.com';
      const client = new MeCaptchaClient(TEST_API_KEY, {
        baseUrl: customUrl,
      });
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: customUrl,
        }),
      );

      process.env.MECAPTCHA_BASE_URL = originalEnv;
    });
  });

  describe('sendCode', () => {
    it('should successfully send code', async () => {
      const mockResponse = {
        success: true,
        hasMeCaptcha: false,
      };

      mockPost.mockResolvedValueOnce({ data: mockResponse });

      const result = await client.sendCode(TEST_PHONE);

      expect(result).toEqual(mockResponse);
      expect(mockPost).toHaveBeenCalledWith('send-verification-code', {
        phoneNumber: TEST_PHONE,
      });
    });

    it('should throw InvalidPhoneError for empty phone number', async () => {
      await expect(client.sendCode('')).rejects.toThrow(InvalidPhoneError);
      await expect(client.sendCode('')).rejects.toThrow('Phone number is required');
    });

    it('should throw InvalidApiKeyError for 401 response', async () => {
      const error = Object.assign(new Error('Unauthorized'), {
        isAxiosError: true,
        response: {
          status: 401,
          data: { error: 'Invalid API key' },
        },
      }) as AxiosError<{ error?: string }>;
      mockPost.mockRejectedValueOnce(error);

      await expect(client.sendCode(TEST_PHONE)).rejects.toThrow(InvalidApiKeyError);
    });

    it('should throw InvalidPhoneError for 400 response with phone error', async () => {
      const error = Object.assign(new Error('Bad Request'), {
        isAxiosError: true,
        response: {
          status: 400,
          data: { error: 'Invalid phone number' },
        },
      }) as AxiosError<{ error?: string }>;
      mockPost.mockRejectedValueOnce(error);

      await expect(client.sendCode(TEST_PHONE)).rejects.toThrow(InvalidPhoneError);
    });

    it('should throw RateLimitError for 429 response', async () => {
      const error = Object.assign(new Error('Too Many Requests'), {
        isAxiosError: true,
        response: {
          status: 429,
          data: { error: 'Rate limit exceeded' },
        },
      }) as AxiosError<{ error?: string }>;
      mockPost.mockRejectedValueOnce(error);

      await expect(client.sendCode(TEST_PHONE)).rejects.toThrow(RateLimitError);
    });

    it('should throw ServerError for 500 response', async () => {
      const error = Object.assign(new Error('Internal Server Error'), {
        isAxiosError: true,
        response: {
          status: 500,
          data: { error: 'Server error' },
        },
      }) as AxiosError<{ error?: string }>;
      mockPost.mockRejectedValueOnce(error);

      await expect(client.sendCode(TEST_PHONE)).rejects.toThrow(ServerError);
    });

    it('should retry on network failure', async () => {
      const mockResponse = {
        success: true,
        hasMeCaptcha: false,
      };

      mockPost
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: mockResponse });

      const result = await client.sendCode(TEST_PHONE);

      expect(result).toEqual(mockResponse);
      expect(mockPost).toHaveBeenCalledTimes(2);
    });

    it('should throw NetworkError after max retries', async () => {
      mockPost.mockRejectedValue(new Error('Network error'));

      await expect(client.sendCode(TEST_PHONE)).rejects.toThrow(NetworkError);
      expect(mockPost).toHaveBeenCalledTimes(3);
    });
  });

  describe('verifyCode', () => {
    it('should successfully verify code', async () => {
      const mockResponse = {
        success: true,
        creditsAwarded: 10,
        hasMeCaptcha: true,
      };

      mockPost.mockResolvedValueOnce({ data: mockResponse });

      const result = await client.verifyCode(TEST_PHONE, TEST_CODE);

      expect(result).toEqual(mockResponse);
      expect(mockPost).toHaveBeenCalledWith('verify-code', {
        phoneNumber: TEST_PHONE,
        code: TEST_CODE,
      });
    });

    it('should throw InvalidPhoneError for empty phone number', async () => {
      await expect(client.verifyCode('', TEST_CODE)).rejects.toThrow(
        InvalidPhoneError,
      );
    });

    it('should throw InvalidCodeError for empty code', async () => {
      await expect(client.verifyCode(TEST_PHONE, '')).rejects.toThrow(
        InvalidCodeError,
      );
      await expect(client.verifyCode(TEST_PHONE, '')).rejects.toThrow(
        'Code must be 6 digits',
      );
    });

    it('should throw InvalidCodeError for invalid code length', async () => {
      await expect(client.verifyCode(TEST_PHONE, '12345')).rejects.toThrow(
        InvalidCodeError,
      );
      await expect(client.verifyCode(TEST_PHONE, '1234567')).rejects.toThrow(
        InvalidCodeError,
      );
    });

    it('should throw InvalidCodeError for 400 response with code error', async () => {
      const error = Object.assign(new Error('Bad Request'), {
        isAxiosError: true,
        response: {
          status: 400,
          data: { error: 'Invalid code' },
        },
      }) as AxiosError<{ error?: string }>;
      mockPost.mockRejectedValueOnce(error);

      await expect(client.verifyCode(TEST_PHONE, TEST_CODE)).rejects.toThrow(
        InvalidCodeError,
      );
    });
  });

  describe('checkPhone', () => {
    it('should successfully check phone', async () => {
      const mockResponse = {
        hasMeCaptcha: true,
      };

      mockPost.mockResolvedValueOnce({ data: mockResponse });

      const result = await client.checkPhone(TEST_PHONE);

      expect(result).toEqual(mockResponse);
      expect(mockPost).toHaveBeenCalledWith('check-phone', {
        phoneNumber: TEST_PHONE,
      });
    });

    it('should throw InvalidPhoneError for empty phone number', async () => {
      await expect(client.checkPhone('')).rejects.toThrow(InvalidPhoneError);
    });
  });
});
