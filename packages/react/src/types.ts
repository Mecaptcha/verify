import type { VerifyCodeResult } from "@mecaptcha/verify-sdk";

export interface MeCaptchaProps {
  apiKey: string;
  onVerify: (result: VerifyCodeResult) => void;
  onError?: (error: Error) => void;
  defaultCountryCode?: string;
  theme?: "light" | "dark" | "auto";
  showBranding?: boolean;
}

export interface MeCaptchaProtectProps {
  apiKey: string;
  children: React.ReactNode;
  onVerified?: (result: VerifyCodeResult) => void;
  requireReauth?: number;
  storageKey?: string;
}

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isValid: boolean;
  error?: string;
}

export interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
  phoneNumber: string;
  isLoading: boolean;
  error?: string;
  resendCooldown: number;
}

export interface DownloadPromptProps {
  show: boolean;
}



