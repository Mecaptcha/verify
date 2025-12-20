import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMeCaptchaRef } from './useMeCaptchaRef';

describe('useMeCaptchaRef', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return ref, isValidPhone, sendCode, and fullPhoneNumber', () => {
    const { result } = renderHook(() =>
      useMeCaptchaRef({
        phoneNumber: '8025551212',
        countryCode: '+1',
      }),
    );

    expect(result.current.ref).toBeDefined();
    expect(typeof result.current.isValidPhone).toBe('boolean');
    expect(typeof result.current.sendCode).toBe('function');
    expect(result.current.fullPhoneNumber).toBeDefined();
  });

  it('should validate 10-digit phone number', () => {
    const { result: validResult } = renderHook(() =>
      useMeCaptchaRef({
        phoneNumber: '8025551212',
        countryCode: '+1',
      }),
    );

    expect(validResult.current.isValidPhone).toBe(true);

    const { result: invalidResult } = renderHook(() =>
      useMeCaptchaRef({
        phoneNumber: '123',
        countryCode: '+1',
      }),
    );

    expect(invalidResult.current.isValidPhone).toBe(false);
  });

  it('should construct full phone number correctly', () => {
    const { result } = renderHook(() =>
      useMeCaptchaRef({
        phoneNumber: '8025551212',
        countryCode: '+1',
      }),
    );

    expect(result.current.fullPhoneNumber).toBe('+18025551212');
  });

  it('should return null for fullPhoneNumber when phone is invalid', () => {
    const { result } = renderHook(() =>
      useMeCaptchaRef({
        phoneNumber: '123',
        countryCode: '+1',
      }),
    );

    expect(result.current.fullPhoneNumber).toBeNull();
  });

  it('should handle phone number with non-digits', () => {
    const { result } = renderHook(() =>
      useMeCaptchaRef({
        phoneNumber: '(802) 555-1212',
        countryCode: '+1',
      }),
    );

    expect(result.current.isValidPhone).toBe(true);
    expect(result.current.fullPhoneNumber).toBe('+18025551212');
  });

  it('should work without options', () => {
    const { result } = renderHook(() => useMeCaptchaRef());

    expect(result.current.ref).toBeDefined();
    expect(result.current.isValidPhone).toBe(false);
    expect(result.current.fullPhoneNumber).toBeNull();
  });

  it('should use default country code when not provided', () => {
    const { result } = renderHook(() =>
      useMeCaptchaRef({
        phoneNumber: '8025551212',
      }),
    );

    expect(result.current.fullPhoneNumber).toBe('+18025551212');
  });

  it('should handle different country codes', () => {
    const { result } = renderHook(() =>
      useMeCaptchaRef({
        phoneNumber: '1234567890',
        countryCode: '+44',
      }),
    );

    expect(result.current.fullPhoneNumber).toBe('+441234567890');
  });
});

