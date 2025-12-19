import { describe, it, expect } from 'vitest';
import { MeCaptchaClient } from './client';
import {
  InvalidApiKeyError,
  InvalidCodeError,
  InvalidPhoneError,
} from './errors';

describe('MeCaptchaClient Integration Tests', () => {
  const TEST_API_KEY = process.env.MECAPTCHA_TEST_API_KEY || 'demo';
  const LIVE_TEST_PHONE = '18025551212';
  const LIVE_TEST_CODE = '123456';

  let client: MeCaptchaClient;

  beforeEach(() => {
    client = new MeCaptchaClient(TEST_API_KEY);
  });

  describe('sendCode', () => {
    it('should successfully send code to live test phone number', async () => {
      const result = await client.sendCode(`+${LIVE_TEST_PHONE}`);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('hasMeCaptcha');
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.hasMeCaptcha).toBe('boolean');
      expect(result.success).toBe(true);
    }, 10000);

    it('should throw InvalidPhoneError for invalid phone number', async () => {
      try {
        await client.sendCode('invalid');
        throw new Error('Expected InvalidPhoneError but request succeeded');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidPhoneError);
      }
    }, 10000);

    it('should throw error for empty phone number', async () => {
      try {
        await client.sendCode('');
        throw new Error('Expected InvalidPhoneError but request succeeded');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidPhoneError);
      }
    }, 10000);
  });

  describe('verifyCode', () => {
    it('should successfully verify code with live test credentials', async () => {
      await client.sendCode(`+${LIVE_TEST_PHONE}`);
      
      const result = await client.verifyCode(
        `+${LIVE_TEST_PHONE}`,
        LIVE_TEST_CODE,
      );

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('creditsAwarded');
      expect(result).toHaveProperty('hasMeCaptcha');
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.creditsAwarded).toBe('number');
      expect(typeof result.hasMeCaptcha).toBe('boolean');
      expect(result.success).toBe(true);
    }, 20000);

    it('should throw InvalidCodeError for invalid code', async () => {
      await client.sendCode(`+${LIVE_TEST_PHONE}`);
      
      try {
        await client.verifyCode(`+${LIVE_TEST_PHONE}`, '000000');
        throw new Error('Expected InvalidCodeError but verification succeeded');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidCodeError);
      }
    }, 20000);

    it('should throw InvalidCodeError for wrong length code', async () => {
      try {
        await client.verifyCode(`+${LIVE_TEST_PHONE}`, '12345');
        throw new Error('Expected InvalidCodeError but verification succeeded');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidCodeError);
      }
    }, 10000);
  });

  describe('checkPhone', () => {
    it('should check phone number status', async () => {
      const result = await client.checkPhone(`+${LIVE_TEST_PHONE}`);

      expect(result).toHaveProperty('hasMeCaptcha');
      expect(typeof result.hasMeCaptcha).toBe('boolean');
    }, 10000);
  });

  describe('end-to-end flow', () => {
    it('should complete full verification flow', async () => {
      const phoneNumber = `+${LIVE_TEST_PHONE}`;

      const sendResult = await client.sendCode(phoneNumber);
      expect(sendResult.success).toBe(true);

      const verifyResult = await client.verifyCode(phoneNumber, LIVE_TEST_CODE);
      expect(verifyResult.success).toBe(true);
      expect(verifyResult.creditsAwarded).toBeGreaterThanOrEqual(0);
    }, 20000);
  });

  describe('demo API key', () => {
    it('should work with demo API key and test credentials', async () => {
      const demoClient = new MeCaptchaClient('demo');
      const phoneNumber = `+${LIVE_TEST_PHONE}`;

      const sendResult = await demoClient.sendCode(phoneNumber);
      expect(sendResult.success).toBe(true);

      const verifyResult = await demoClient.verifyCode(
        phoneNumber,
        LIVE_TEST_CODE,
      );
      expect(verifyResult.success).toBe(true);
      expect(verifyResult.creditsAwarded).toBeGreaterThanOrEqual(0);
    }, 20000);

    it('should reject demo API key with wrong phone number', async () => {
      const demoClient = new MeCaptchaClient('demo');
      const wrongPhone = '+15551234567';

      try {
        await demoClient.sendCode(wrongPhone);
        throw new Error('Expected error but request succeeded');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).not.toBeInstanceOf(InvalidCodeError);
      }
    }, 10000);

    it('should reject demo API key with wrong code', async () => {
      const demoClient = new MeCaptchaClient('demo');
      const phoneNumber = `+${LIVE_TEST_PHONE}`;

      await demoClient.sendCode(phoneNumber);
      
      try {
        await demoClient.verifyCode(phoneNumber, '000000');
        throw new Error('Expected InvalidCodeError but verification succeeded');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidCodeError);
      }
    }, 20000);
  });
});

