import { useRef, useCallback, useMemo } from "react";
import type { MeCaptchaHandle } from "../types";

export interface UseMeCaptchaRefOptions {
  phoneNumber?: string;
  countryCode?: string;
}

export interface UseMeCaptchaRefReturn {
  ref: React.RefObject<MeCaptchaHandle>;
  isValidPhone: boolean;
  sendCode: () => Promise<void>;
  fullPhoneNumber: string | null;
}

/**
 * Hook to simplify using MeCaptcha with external phone number control.
 * 
 * @example
 * ```tsx
 * const { ref, isValidPhone, sendCode } = useMeCaptchaRef({
 *   phoneNumber: "8025551212",
 *   countryCode: "+1"
 * });
 * 
 * <MeCaptcha ref={ref} phoneNumber={phoneNumber} onVerify={handleVerify} />
 * 
 * <button onClick={sendCode} disabled={!isValidPhone}>
 *   Send Code
 * </button>
 * ```
 */
export function useMeCaptchaRef(
  options?: UseMeCaptchaRefOptions,
): UseMeCaptchaRefReturn {
  const { phoneNumber = "", countryCode = "+1" } = options || {};
  const ref = useRef<MeCaptchaHandle>(null);

  // Validate phone number (10 digits for US, can be extended)
  const isValidPhone = useMemo(() => {
    const cleaned = phoneNumber.replace(/\D/g, "");
    return cleaned.length === 10;
  }, [phoneNumber]);

  // Get full phone number with country code
  const fullPhoneNumber = useMemo(() => {
    if (!phoneNumber) return null;
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return `${countryCode}${cleaned}`;
    }
    return null;
  }, [phoneNumber, countryCode]);

  // Convenient sendCode function that validates before sending
  const sendCode = useCallback(async () => {
    if (!isValidPhone || !ref.current) {
      throw new Error("Phone number is invalid or MeCaptcha ref is not available");
    }
    await ref.current.sendCode();
  }, [isValidPhone]);

  return {
    ref,
    isValidPhone,
    sendCode,
    fullPhoneNumber,
  };
}

