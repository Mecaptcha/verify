# External Phone Example

Example showing how to use MeCaptcha with an external phone number input.

## Run

```bash
cd examples/external-phone
pnpm install
pnpm dev
```

Open http://localhost:5173

## Features

- External phone number input (outside MeCaptcha component)
- `useMeCaptchaRef` hook for easy integration
- Phone validation helper
- MeCaptcha handles only code sending and verification
- No race conditions - phone can change freely

## Use Case

This example demonstrates the use case where:
1. Your app collects the phone number (e.g., during signup)
2. MeCaptcha sends the verification code
3. MeCaptcha shows the code input screen
4. MeCaptcha calls `onVerify` when code is verified

## Demo Credentials

- API Key: `demo`
- Phone: `8025551212` (or `+18025551212`)
- Code: `123456`

