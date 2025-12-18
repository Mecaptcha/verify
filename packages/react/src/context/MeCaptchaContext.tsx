import { createContext, useContext } from "react";
import type { VerifyCodeResult } from "@mecaptcha/verify-sdk";

export interface MeCaptchaContextValue {
  apiKey: string;
  isVerified: boolean;
  verificationResult?: VerifyCodeResult;
}

export const MeCaptchaContext = createContext<MeCaptchaContextValue | null>(
  null,
);

export function useMeCaptchaContext() {
  const context = useContext(MeCaptchaContext);
  if (!context) {
    throw new Error(
      "useMeCaptchaContext must be used within MeCaptchaProvider",
    );
  }
  return context;
}



