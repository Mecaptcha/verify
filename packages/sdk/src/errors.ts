export class MeCaptchaError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = "MeCaptchaError";
  }
}

export class InvalidApiKeyError extends MeCaptchaError {
  constructor(message = "Invalid API key") {
    super(message, "INVALID_API_KEY", 401);
    this.name = "InvalidApiKeyError";
  }
}

export class InvalidCodeError extends MeCaptchaError {
  constructor(message = "Invalid verification code") {
    super(message, "INVALID_CODE", 400);
    this.name = "InvalidCodeError";
  }
}

export class InvalidPhoneError extends MeCaptchaError {
  constructor(message = "Invalid phone number") {
    super(message, "INVALID_PHONE", 400);
    this.name = "InvalidPhoneError";
  }
}

export class RateLimitError extends MeCaptchaError {
  constructor(message = "Rate limit exceeded") {
    super(message, "RATE_LIMIT", 429);
    this.name = "RateLimitError";
  }
}

export class NetworkError extends MeCaptchaError {
  constructor(message = "Network request failed") {
    super(message, "NETWORK_ERROR");
    this.name = "NetworkError";
  }
}

export class ServerError extends MeCaptchaError {
  constructor(message = "Server error") {
    super(message, "SERVER_ERROR", 500);
    this.name = "ServerError";
  }
}



