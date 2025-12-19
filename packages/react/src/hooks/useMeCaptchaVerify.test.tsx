import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useMeCaptchaVerify } from './useMeCaptchaVerify';
import { MeCaptchaClient } from '@mecaptcha/verify-sdk';
import { InvalidCodeError, InvalidPhoneError } from '@mecaptcha/verify-sdk';

vi.mock('@mecaptcha/verify-sdk', () => {
  const mockClient = {
    sendCode: vi.fn(),
    verifyCode: vi.fn(),
    checkPhone: vi.fn(),
  };

  return {
    MeCaptchaClient: vi.fn(() => mockClient),
    InvalidCodeError: class extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'InvalidCodeError';
      }
    },
    InvalidPhoneError: class extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'InvalidPhoneError';
      }
    },
  };
});

describe('useMeCaptchaVerify', () => {
  const TEST_API_KEY = 'mec_test_abc123';
  const TEST_PHONE = '5551234567';
  const TEST_COUNTRY_CODE = '+1';
  const TEST_FULL_PHONE = `${TEST_COUNTRY_CODE}${TEST_PHONE}`;
  const TEST_CODE = '123456';

  let mockClient: {
    sendCode: ReturnType<typeof vi.fn>;
    verifyCode: ReturnType<typeof vi.fn>;
    checkPhone: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const MeCaptchaClientMock = MeCaptchaClient as unknown as ReturnType<
      typeof vi.fn
    >;
    mockClient = MeCaptchaClientMock.mock.results[0]?.value || {
      sendCode: vi.fn(),
      verifyCode: vi.fn(),
      checkPhone: vi.fn(),
    };
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useMeCaptchaVerify(TEST_API_KEY));

      expect(result.current.phoneNumber).toBe('');
      expect(result.current.countryCode).toBe('+1');
      expect(result.current.code).toBe('');
      expect(result.current.step).toBe('phone');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.hasMeCaptcha).toBe(false);
      expect(result.current.isVerified).toBe(false);
      expect(result.current.resendCooldown).toBe(0);
    });

    it('should create MeCaptchaClient with API key', () => {
      renderHook(() => useMeCaptchaVerify(TEST_API_KEY));
      expect(MeCaptchaClient).toHaveBeenCalledWith(TEST_API_KEY);
    });
  });

  describe('phone number management', () => {
    it('should update phone number', () => {
      const { result } = renderHook(() => useMeCaptchaVerify(TEST_API_KEY));

      act(() => {
        result.current.setPhoneNumber(TEST_PHONE);
      });

      expect(result.current.phoneNumber).toBe(TEST_PHONE);
    });

    it('should update country code', () => {
      const { result } = renderHook(() => useMeCaptchaVerify(TEST_API_KEY));

      act(() => {
        result.current.setCountryCode('+44');
      });

      expect(result.current.countryCode).toBe('+44');
    });

    it('should get full phone number', () => {
      const { result } = renderHook(() => useMeCaptchaVerify(TEST_API_KEY));

      act(() => {
        result.current.setCountryCode(TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(TEST_PHONE);
      });

      expect(result.current.getFullPhoneNumber()).toBe(TEST_FULL_PHONE);
    });
  });

  describe('sendCode', () => {
    it('should successfully send code', async () => {
      const mockResult = {
        success: true,
        hasMeCaptcha: false,
      };

      mockClient.sendCode.mockResolvedValueOnce(mockResult);

      const { result } = renderHook(() => useMeCaptchaVerify(TEST_API_KEY));

      act(() => {
        result.current.setCountryCode(TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(TEST_PHONE);
      });

      await act(async () => {
        await result.current.sendCode();
      });

      await waitFor(() => {
        expect(result.current.step).toBe('code');
        expect(result.current.hasMeCaptcha).toBe(false);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.resendCooldown).toBe(60);
      });

      expect(mockClient.sendCode).toHaveBeenCalledWith(TEST_FULL_PHONE);
    });

    it('should handle sendCode error', async () => {
      const mockError = new InvalidPhoneError('Invalid phone number');
      mockClient.sendCode.mockRejectedValueOnce(mockError);

      const onError = vi.fn();
      const { result } = renderHook(() =>
        useMeCaptchaVerify(TEST_API_KEY, { onError }),
      );

      act(() => {
        result.current.setCountryCode(TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(TEST_PHONE);
      });

      await act(async () => {
        await result.current.sendCode();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Invalid phone number');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.step).toBe('phone');
      });

      expect(onError).toHaveBeenCalledWith(mockError);
    });

    it('should set hasMeCaptcha when user has account', async () => {
      const mockResult = {
        success: true,
        hasMeCaptcha: true,
      };

      mockClient.sendCode.mockResolvedValueOnce(mockResult);

      const { result } = renderHook(() => useMeCaptchaVerify(TEST_API_KEY));

      act(() => {
        result.current.setCountryCode(TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(TEST_PHONE);
      });

      await act(async () => {
        await result.current.sendCode();
      });

      await waitFor(() => {
        expect(result.current.hasMeCaptcha).toBe(true);
      });
    });
  });

  describe('verifyCode', () => {
    beforeEach(() => {
      const { result } = renderHook(() => useMeCaptchaVerify(TEST_API_KEY));
      act(() => {
        result.current.setCountryCode(TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(TEST_PHONE);
        result.current.setCode(TEST_CODE);
      });
    });

    it('should successfully verify code', async () => {
      const mockResult = {
        success: true,
        creditsAwarded: 10,
        hasMeCaptcha: true,
      };

      mockClient.verifyCode.mockResolvedValueOnce(mockResult);

      const onVerify = vi.fn();
      const { result } = renderHook(() =>
        useMeCaptchaVerify(TEST_API_KEY, { onVerify }),
      );

      act(() => {
        result.current.setCountryCode(TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(TEST_PHONE);
        result.current.setCode(TEST_CODE);
      });

      await act(async () => {
        await result.current.verifyCode();
      });

      await waitFor(() => {
        expect(result.current.isVerified).toBe(true);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
      });

      expect(mockClient.verifyCode).toHaveBeenCalledWith(
        TEST_FULL_PHONE,
        TEST_CODE,
      );
      expect(onVerify).toHaveBeenCalledWith(mockResult);
    });

    it('should handle verifyCode error', async () => {
      const mockError = new InvalidCodeError('Invalid code');
      mockClient.verifyCode.mockRejectedValueOnce(mockError);

      const onError = vi.fn();
      const { result } = renderHook(() =>
        useMeCaptchaVerify(TEST_API_KEY, { onError }),
      );

      act(() => {
        result.current.setCountryCode(TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(TEST_PHONE);
        result.current.setCode(TEST_CODE);
      });

      await act(async () => {
        await result.current.verifyCode();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Invalid code');
        expect(result.current.isLoading).toBe(false);
      });

      expect(onError).toHaveBeenCalledWith(mockError);
    });

    it('should accept code parameter', async () => {
      const mockResult = {
        success: true,
        creditsAwarded: 10,
        hasMeCaptcha: true,
      };

      mockClient.verifyCode.mockResolvedValueOnce(mockResult);

      const { result } = renderHook(() => useMeCaptchaVerify(TEST_API_KEY));

      act(() => {
        result.current.setCountryCode(TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(TEST_PHONE);
      });

      await act(async () => {
        await result.current.verifyCode('654321');
      });

      expect(mockClient.verifyCode).toHaveBeenCalledWith(
        TEST_FULL_PHONE,
        '654321',
      );
    });
  });

  describe('checkPhone', () => {
    it('should check phone and update hasMeCaptcha', async () => {
      const mockResult = {
        hasMeCaptcha: true,
      };

      mockClient.checkPhone.mockResolvedValueOnce(mockResult);

      const { result } = renderHook(() => useMeCaptchaVerify(TEST_API_KEY));

      act(() => {
        result.current.setCountryCode(TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(TEST_PHONE);
      });

      let checkResult: boolean;
      await act(async () => {
        checkResult = await result.current.checkPhone();
      });

      await waitFor(() => {
        expect(result.current.hasMeCaptcha).toBe(true);
      });

      expect(checkResult!).toBe(true);
      expect(mockClient.checkPhone).toHaveBeenCalledWith(TEST_FULL_PHONE);
    });

    it('should handle checkPhone error', async () => {
      const mockError = new InvalidPhoneError('Invalid phone');
      mockClient.checkPhone.mockRejectedValueOnce(mockError);

      const onError = vi.fn();
      const { result } = renderHook(() =>
        useMeCaptchaVerify(TEST_API_KEY, { onError }),
      );

      act(() => {
        result.current.setCountryCode(TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(TEST_PHONE);
      });

      let checkResult: boolean;
      await act(async () => {
        checkResult = await result.current.checkPhone();
      });

      expect(checkResult!).toBe(false);
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('resendCooldown', () => {
    it('should set resend cooldown after sending code', async () => {
      const mockResult = {
        success: true,
        hasMeCaptcha: false,
      };

      mockClient.sendCode.mockResolvedValueOnce(mockResult);

      const { result } = renderHook(() => useMeCaptchaVerify(TEST_API_KEY));

      act(() => {
        result.current.setCountryCode(TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(TEST_PHONE);
      });

      await act(async () => {
        await result.current.sendCode();
      });

      await waitFor(() => {
        expect(result.current.resendCooldown).toBe(60);
      });
    });
  });

  describe('reset', () => {
    it('should reset all state', async () => {
      const mockResult = {
        success: true,
        hasMeCaptcha: false,
      };

      mockClient.sendCode.mockResolvedValueOnce(mockResult);

      const { result } = renderHook(() => useMeCaptchaVerify(TEST_API_KEY));

      act(() => {
        result.current.setCountryCode(TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(TEST_PHONE);
      });

      await act(async () => {
        await result.current.sendCode();
      });

      act(() => {
        result.current.setCode(TEST_CODE);
        result.current.reset();
      });

      expect(result.current.phoneNumber).toBe('');
      expect(result.current.code).toBe('');
      expect(result.current.step).toBe('phone');
      expect(result.current.error).toBeNull();
      expect(result.current.hasMeCaptcha).toBe(false);
      expect(result.current.isVerified).toBe(false);
      expect(result.current.resendCooldown).toBe(0);
    });
  });

  describe('editNumber', () => {
    it('should allow editing phone number', async () => {
      const mockResult = {
        success: true,
        hasMeCaptcha: false,
      };

      mockClient.sendCode.mockResolvedValueOnce(mockResult);

      const { result } = renderHook(() => useMeCaptchaVerify(TEST_API_KEY));

      act(() => {
        result.current.setCountryCode(TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(TEST_PHONE);
      });

      await act(async () => {
        await result.current.sendCode();
      });

      act(() => {
        result.current.setCode('123');
        result.current.editNumber();
      });

      expect(result.current.step).toBe('phone');
      expect(result.current.code).toBe('');
      expect(result.current.error).toBeNull();
      expect(result.current.resendCooldown).toBe(0);
    });
  });
});

