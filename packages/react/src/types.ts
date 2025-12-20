import type { VerifyCodeResult } from "@mecaptcha/verify-sdk";

export interface MeCaptchaProps {
  apiKey: string;
  onVerify: (result: VerifyCodeResult) => void;
  onError?: (error: Error) => void;
  defaultCountryCode?: string;
  theme?: "light" | "dark" | "auto";
  showBranding?: boolean;
  baseUrl?: string;
  // External phone number control
  phoneNumber?: string;
  countryCode?: string;
}

export interface MeCaptchaProtectProps {
  apiKey: string;
  children: React.ReactNode;
  onVerified?: (result: VerifyCodeResult) => void;
  onError?: (error: Error) => void;
  requireReauth?: number;
  storageKey?: string;
  baseUrl?: string;
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
  onSubmit: (code: string) => void;
  onResend: () => void;
  phoneNumber: string;
  isLoading: boolean;
  error?: string;
  resendCooldown: number;
}

export interface DownloadPromptProps {
  show: boolean;
}

export interface MeCaptchaHandle {
  sendCode: () => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
}



