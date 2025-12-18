import {
  InvalidApiKeyError,
  InvalidCodeError,
  InvalidPhoneError,
  NetworkError,
  RateLimitError,
  ServerError,
} from "./errors";
import type {
  CheckPhoneResult,
  MeCaptchaClientOptions,
  SendCodeResult,
  VerifyCodeResult,
} from "./types";

const DEFAULT_BASE_URL =
  "https://cmpqvlxjwgtcagjixpzg.supabase.co/functions/v1";

export class MeCaptchaClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, options?: MeCaptchaClientOptions) {
    if (!apiKey) {
      throw new Error("API key is required");
    }

    if (!apiKey.startsWith("mec_live_") && !apiKey.startsWith("mec_test_")) {
      throw new Error(
        'API key must start with "mec_live_" or "mec_test_"',
      );
    }

    this.apiKey = apiKey;
    this.baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    body: unknown,
    retries = 2,
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
          switch (response.status) {
            case 401:
              throw new InvalidApiKeyError(
                data.error || "Invalid API key",
              );
            case 400:
              if (data.error?.includes("code")) {
                throw new InvalidCodeError(data.error);
              }
              if (data.error?.includes("phone")) {
                throw new InvalidPhoneError(data.error);
              }
              throw new InvalidCodeError(data.error);
            case 429:
              throw new RateLimitError(
                data.error || "Rate limit exceeded",
              );
            case 500:
            case 502:
            case 503:
              throw new ServerError(
                data.error || "Server error",
              );
            default:
              throw new ServerError(
                data.error || `Request failed with status ${response.status}`,
              );
          }
        }

        return data;
      } catch (error) {
        if (
          error instanceof InvalidApiKeyError ||
          error instanceof InvalidCodeError ||
          error instanceof InvalidPhoneError ||
          error instanceof RateLimitError
        ) {
          throw error;
        }

        if (attempt === retries) {
          if (error instanceof ServerError) {
            throw error;
          }
          throw new NetworkError(
            error instanceof Error ? error.message : "Network request failed",
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    throw new NetworkError("Max retries exceeded");
  }

  async sendCode(phoneNumber: string): Promise<SendCodeResult> {
    if (!phoneNumber) {
      throw new InvalidPhoneError("Phone number is required");
    }

    return this.request<SendCodeResult>("send-verification-code", {
      phoneNumber,
    });
  }

  async verifyCode(
    phoneNumber: string,
    code: string,
  ): Promise<VerifyCodeResult> {
    if (!phoneNumber) {
      throw new InvalidPhoneError("Phone number is required");
    }

    if (!code || code.length !== 6) {
      throw new InvalidCodeError("Code must be 6 digits");
    }

    return this.request<VerifyCodeResult>("verify-code", {
      phoneNumber,
      code,
    });
  }

  async checkPhone(phoneNumber: string): Promise<CheckPhoneResult> {
    if (!phoneNumber) {
      throw new InvalidPhoneError("Phone number is required");
    }

    return this.request<CheckPhoneResult>("check-phone", {
      phoneNumber,
    });
  }
}



