export interface MeCaptchaClientOptions {
  baseUrl?: string;
}

export interface SendCodeResult {
  success: boolean;
  hasMeCaptcha: boolean;
}

export interface VerifyCodeResult {
  success: boolean;
  creditsAwarded: number;
  hasMeCaptcha: boolean;
}

export interface CheckPhoneResult {
  hasMeCaptcha: boolean;
}



