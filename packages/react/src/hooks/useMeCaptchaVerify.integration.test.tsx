import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useMeCaptchaVerify } from './useMeCaptchaVerify';

describe('useMeCaptchaVerify Integration Tests', () => {
  const TEST_API_KEY = process.env.MECAPTCHA_TEST_API_KEY || 'mec_test_abc123';
  const LIVE_TEST_PHONE = '18025551212';
  const LIVE_TEST_CODE = '123456';
  const LIVE_TEST_COUNTRY_CODE = '+1';
  const LIVE_TEST_FULL_PHONE = `${LIVE_TEST_COUNTRY_CODE}${LIVE_TEST_PHONE}`;

  describe('end-to-end verification flow', () => {
    it('should complete full verification flow with live API', async () => {
      const onVerify = vi.fn();
      const { result } = renderHook(() =>
        useMeCaptchaVerify(TEST_API_KEY, { onVerify }),
      );

      act(() => {
        result.current.setCountryCode(LIVE_TEST_COUNTRY_CODE);
        result.current.setPhoneNumber(LIVE_TEST_PHONE);
      });

      expect(result.current.getFullPhoneNumber()).toBe(LIVE_TEST_FULL_PHONE);

      await act(async () => {
        await result.current.sendCode();
      });

      await waitFor(
        () => {
          expect(result.current.step).toBe('code');
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 },
      );

      act(() => {
        result.current.setCode(LIVE_TEST_CODE);
      });

      await act(async () => {
        await result.current.verifyCode();
      });

      await waitFor(
        () => {
          expect(result.current.isVerified).toBe(true);
          expect(result.current.isLoading).toBe(false);
        },
        { timeout: 10000 },
      );

      expect(onVerify).toHaveBeenCalled();
      const verifyResult = onVerify.mock.calls[0][0];
      expect(verifyResult).toHaveProperty('success');
      expect(verifyResult).toHaveProperty('creditsAwarded');
      expect(verifyResult).toHaveProperty('hasMeCaptcha');
    }, 30000);
  });
});

