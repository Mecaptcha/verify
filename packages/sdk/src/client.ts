import axios, { AxiosError, AxiosInstance } from "axios";
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

const DEFAULT_BASE_URL = "https://api.mecaptcha.com/v1";

function getBaseUrl(options?: MeCaptchaClientOptions): string {
  if (options?.baseUrl) {
    return options.baseUrl;
  }
  
  try {
    if (
      typeof process !== "undefined" &&
      process.env &&
      (process.env as Record<string, string | undefined>).MECAPTCHA_BASE_URL
    ) {
      return (process.env as Record<string, string>).MECAPTCHA_BASE_URL;
    }
  } catch {
    // process.env not available (e.g., in browser)
  }
  
  if (typeof window !== "undefined" && (window as any).MECAPTCHA_BASE_URL) {
    return (window as any).MECAPTCHA_BASE_URL;
  }
  
  return DEFAULT_BASE_URL;
}

export class MeCaptchaClient {
  private apiKey: string;
  private axiosInstance: AxiosInstance;

  constructor(apiKey: string, options?: MeCaptchaClientOptions) {
    if (!apiKey) {
      throw new Error("API key is required");
    }

    if (
      apiKey !== "demo" &&
      !apiKey.startsWith("mec_live_") &&
      !apiKey.startsWith("mec_test_")
    ) {
      throw new Error(
        'API key must be "demo" or start with "mec_live_" or "mec_test_"',
      );
    }

    this.apiKey = apiKey;
    const baseUrl = getBaseUrl(options);

    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  private async request<T>(
    endpoint: string,
    body: unknown,
    retries = 2,
  ): Promise<T> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.axiosInstance.post<T>(endpoint, body);
        return response.data;
      } catch (error) {
        if (
          error instanceof InvalidApiKeyError ||
          error instanceof InvalidCodeError ||
          error instanceof InvalidPhoneError ||
          error instanceof RateLimitError
        ) {
          throw error;
        }

        const axiosError = error as AxiosError<{ error?: string }>;
        if (axios.isAxiosError(error) || axiosError.response) {
          const status = axiosError.response?.status;
          const errorMessage =
            axiosError.response?.data?.error ||
            axiosError.message ||
            "Request failed";

          if (status === 401) {
            throw new InvalidApiKeyError(errorMessage);
          }
          if (status === 400) {
            if (errorMessage.includes("code")) {
              throw new InvalidCodeError(errorMessage);
            }
            if (errorMessage.includes("phone")) {
              throw new InvalidPhoneError(errorMessage);
            }
            throw new InvalidCodeError(errorMessage);
          }
          if (status === 429) {
            throw new RateLimitError(errorMessage);
          }
          if (status === 500 || status === 502 || status === 503) {
            throw new ServerError(errorMessage);
          }
          if (status) {
            throw new ServerError(errorMessage);
          }
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



