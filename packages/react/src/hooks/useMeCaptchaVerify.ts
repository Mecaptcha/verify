import { useCallback, useEffect, useState, useRef } from "react";
import { MeCaptchaClient } from "@mecaptcha/verify-sdk";
import type { VerifyCodeResult } from "@mecaptcha/verify-sdk";

export interface UseMeCaptchaVerifyOptions {
  onVerify?: (result: VerifyCodeResult) => void;
  onError?: (error: Error) => void;
  baseUrl?: string;
  initialPhoneNumber?: string;
  initialCountryCode?: string;
}

export function useMeCaptchaVerify(
  apiKey: string,
  options?: UseMeCaptchaVerifyOptions,
) {
  const [client] = useState(
    () => new MeCaptchaClient(apiKey, { baseUrl: options?.baseUrl }),
  );
  
  // Parse initial phone number if provided
  const parsePhoneNumber = useCallback((phone?: string, countryCode?: string) => {
    if (!phone) return { phoneNumber: "", countryCode: countryCode || "+1" };
    
    // If phone starts with +, extract country code
    if (phone.startsWith("+")) {
      // Try to extract country code (assume 1-3 digits after +)
      const match = phone.match(/^\+(\d{1,3})(.+)$/);
      if (match) {
        return {
          phoneNumber: match[2].replace(/\D/g, ""),
          countryCode: `+${match[1]}`,
        };
      }
    }
    
    // Otherwise use provided country code or default
    return {
      phoneNumber: phone.replace(/\D/g, ""),
      countryCode: countryCode || "+1",
    };
  }, []);
  
  const initial = parsePhoneNumber(options?.initialPhoneNumber, options?.initialCountryCode);
  const [phoneNumber, setPhoneNumber] = useState(initial.phoneNumber);
  const [countryCode, setCountryCode] = useState(initial.countryCode);
  const [code, setCode] = useState("");
  // If initial phone number provided, start at code step
  const [step, setStep] = useState<"phone" | "code">(
    initial.phoneNumber.length === 10 ? "code" : "phone"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMeCaptcha, setHasMeCaptcha] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Track previous initialPhoneNumber to prevent unnecessary updates
  const prevInitialPhoneRef = useRef<string | undefined>(options?.initialPhoneNumber);
  const isFirstRender = useRef(true);

  // Update phone number when initialPhoneNumber prop changes (skip first render)
  useEffect(() => {
    // Skip on first render since we initialize state correctly
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevInitialPhoneRef.current = options?.initialPhoneNumber;
      return;
    }

    const currentPhone = options?.initialPhoneNumber;
    const currentCountryCode = options?.initialCountryCode;
    
    // Only update if the values actually changed
    if (
      currentPhone !== undefined &&
      currentPhone !== prevInitialPhoneRef.current
    ) {
      const parsed = parsePhoneNumber(currentPhone, currentCountryCode);
      setPhoneNumber(parsed.phoneNumber);
      if (parsed.countryCode) {
        setCountryCode(parsed.countryCode);
      }
      // If phone is valid, move to code step
      if (parsed.phoneNumber.length === 10) {
        setStep("code");
      }
      
      // Update ref
      prevInitialPhoneRef.current = currentPhone;
    }
  }, [options?.initialPhoneNumber, options?.initialCountryCode]);

  const getFullPhoneNumber = useCallback(() => {
    return `${countryCode}${phoneNumber}`;
  }, [countryCode, phoneNumber]);

  const sendCode = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await client.sendCode(getFullPhoneNumber());
      setHasMeCaptcha(result.hasMeCaptcha);
      setStep("code");
      setCode("");
      setResendCooldown(60);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send code";
      setError(message);
      options?.onError?.(err instanceof Error ? err : new Error(message));
    } finally {
      setIsLoading(false);
    }
  }, [client, getFullPhoneNumber, options]);

  const verifyCode = useCallback(
    async (codeToVerify?: string) => {
      const codeValue = (codeToVerify || code).trim().replace(/\D/g, "");
      if (codeValue.length !== 6) {
        setError("Code must be 6 digits");
        return;
      }
      setIsLoading(true);
      setError(null);

      try {
        const result = await client.verifyCode(
          getFullPhoneNumber(),
          codeValue,
        );
        setIsVerified(true);
        options?.onVerify?.(result);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to verify code";
        setError(message);
        options?.onError?.(err instanceof Error ? err : new Error(message));
      } finally {
        setIsLoading(false);
      }
    },
    [client, getFullPhoneNumber, code, options],
  );

  const checkPhone = useCallback(
    async (phone?: string) => {
      const phoneToCheck = phone || getFullPhoneNumber();

      try {
        const result = await client.checkPhone(phoneToCheck);
        setHasMeCaptcha(result.hasMeCaptcha);
        return result.hasMeCaptcha;
      } catch (err) {
        options?.onError?.(
          err instanceof Error ? err : new Error("Failed to check phone"),
        );
        return false;
      }
    },
    [client, getFullPhoneNumber, options],
  );

  const reset = useCallback(() => {
    setPhoneNumber("");
    setCode("");
    setStep("phone");
    setError(null);
    setHasMeCaptcha(false);
    setIsVerified(false);
    setResendCooldown(0);
  }, []);

  const editNumber = useCallback(() => {
    setStep("phone");
    setCode("");
    setError(null);
    setResendCooldown(0);
  }, []);

  return {
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    code,
    setCode,
    step,
    isLoading,
    error,
    hasMeCaptcha,
    isVerified,
    resendCooldown,
    sendCode,
    verifyCode,
    checkPhone,
    reset,
    editNumber,
    getFullPhoneNumber,
  };
}



