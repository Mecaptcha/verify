import { useCallback, useEffect, useState } from "react";
import { MeCaptchaClient } from "@mecaptcha/verify-sdk";
import type { VerifyCodeResult } from "@mecaptcha/verify-sdk";

export interface UseMeCaptchaVerifyOptions {
  onVerify?: (result: VerifyCodeResult) => void;
  onError?: (error: Error) => void;
  baseUrl?: string;
}

export function useMeCaptchaVerify(
  apiKey: string,
  options?: UseMeCaptchaVerifyOptions,
) {
  const [client] = useState(
    () => new MeCaptchaClient(apiKey, { baseUrl: options?.baseUrl }),
  );
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
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



