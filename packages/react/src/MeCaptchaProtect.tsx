import { useEffect, useState } from "react";
import type { VerifyCodeResult } from "@mecaptcha/verify-sdk";
import { MeCaptcha } from "./MeCaptcha";
import type { MeCaptchaProtectProps } from "./types";
import { MeCaptchaContext } from "./context/MeCaptchaContext";

export function MeCaptchaProtect({
  apiKey,
  children,
  onVerified,
  onError,
  requireReauth,
  storageKey = "mecaptcha_verified",
  baseUrl,
}: MeCaptchaProtectProps) {
  const [isVerified, setIsVerified] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerifyCodeResult>();

  useEffect(() => {
    const stored = sessionStorage.getItem(storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const verifiedAt = new Date(data.verifiedAt).getTime();
        const now = Date.now();

        if (requireReauth) {
          const maxAge = requireReauth * 60 * 1000;
          if (now - verifiedAt < maxAge) {
            setIsVerified(true);
            setVerificationResult(data.result);
            return;
          }
        } else {
          setIsVerified(true);
          setVerificationResult(data.result);
          return;
        }
      } catch (error) {
        sessionStorage.removeItem(storageKey);
      }
    }
  }, [storageKey, requireReauth]);

  const handleVerify = (result: VerifyCodeResult) => {
    setIsVerified(true);
    setVerificationResult(result);

    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        verifiedAt: new Date().toISOString(),
        result,
      }),
    );

    onVerified?.(result);
  };

  if (!isVerified) {
    return (
      <MeCaptcha
        apiKey={apiKey}
        onVerify={handleVerify}
        onError={onError}
        baseUrl={baseUrl}
      />
    );
  }

  return (
    <MeCaptchaContext.Provider
      value={{
        apiKey,
        isVerified: true,
        verificationResult,
      }}
    >
      {children}
    </MeCaptchaContext.Provider>
  );
}



