# @mecaptcha/verify-sdk

Headless TypeScript SDK for MeCaptcha SMS verification. Zero dependencies, works everywhere.

## Installation

```bash
npm install @mecaptcha/verify-sdk
# or
pnpm add @mecaptcha/verify-sdk
# or
yarn add @mecaptcha/verify-sdk
```

## Quick Start

```typescript
import { MeCaptchaClient } from '@mecaptcha/verify-sdk';

const client = new MeCaptchaClient('mec_live_...');

const sendResult = await client.sendCode('+15551234567');

const verifyResult = await client.verifyCode('+15551234567', '123456');
console.log('Credits awarded:', verifyResult.creditsAwarded);
```

## API Reference

### `new MeCaptchaClient(apiKey, options?)`

Creates a new client instance.

**Parameters:**
- `apiKey` (string, required) - Your MeCaptcha API key
- `options` (object, optional)
  - `baseUrl` (string) - Custom API base URL

**Example:**
```typescript
const client = new MeCaptchaClient('mec_live_abc123');
```

### `sendCode(phoneNumber: string): Promise<SendCodeResult>`

Sends a 6-digit verification code via SMS.

**Parameters:**
- `phoneNumber` (string) - Phone number in E.164 format (+15551234567)

**Returns:**
```typescript
{
  success: boolean;
  hasMeCaptcha: boolean;  // True if user has MeCaptcha account
}
```

**Example:**
```typescript
const result = await client.sendCode('+15551234567');
if (result.hasMeCaptcha) {
  console.log('User will earn humanity credits!');
}
```

### `verifyCode(phoneNumber: string, code: string): Promise<VerifyCodeResult>`

Verifies the SMS code and awards credits if applicable.

**Parameters:**
- `phoneNumber` (string) - Phone number in E.164 format
- `code` (string) - 6-digit code received via SMS

**Returns:**
```typescript
{
  success: boolean;
  creditsAwarded: number;  // 0-5 credits (daily limit)
  hasMeCaptcha: boolean;
}
```

**Example:**
```typescript
const result = await client.verifyCode('+15551234567', '123456');
console.log('Credits awarded:', result.creditsAwarded);
```

### `checkPhone(phoneNumber: string): Promise<CheckPhoneResult>`

Checks if a phone number has a MeCaptcha account.

**Parameters:**
- `phoneNumber` (string) - Phone number in E.164 format

**Returns:**
```typescript
{
  hasMeCaptcha: boolean;
}
```

**Example:**
```typescript
const result = await client.checkPhone('+15551234567');
if (!result.hasMeCaptcha) {
  console.log('Show download prompt');
}
```

## Error Handling

All methods can throw the following errors:

### `InvalidApiKeyError`

Thrown when API key is invalid or inactive.

```typescript
try {
  await client.sendCode('+15551234567');
} catch (error) {
  if (error instanceof InvalidApiKeyError) {
    console.error('Check your API key');
  }
}
```

### `InvalidCodeError`

Thrown when verification code is incorrect or expired.

### `InvalidPhoneError`

Thrown when phone number is invalid or improperly formatted.

### `RateLimitError`

Thrown when rate limit is exceeded. Retry after a delay.

### `NetworkError`

Thrown after network failures. The SDK automatically retries twice before throwing.

### `ServerError`

Thrown on server-side errors (5xx responses).

## Advanced Usage

### Custom Base URL

For testing or self-hosted instances:

```typescript
const client = new MeCaptchaClient('mec_test_...', {
  baseUrl: 'http://localhost:54321/functions/v1'
});
```

### Error Handling Pattern

```typescript
import { 
  MeCaptchaClient, 
  InvalidCodeError,
  RateLimitError,
  NetworkError 
} from '@mecaptcha/verify-sdk';

try {
  const result = await client.verifyCode(phone, code);
  console.log('Success!', result);
} catch (error) {
  if (error instanceof InvalidCodeError) {
    alert('Wrong code. Try again.');
  } else if (error instanceof RateLimitError) {
    alert('Too many attempts. Wait a moment.');
  } else if (error instanceof NetworkError) {
    alert('Network error. Check your connection.');
  } else {
    alert('Unexpected error. Please try again.');
  }
}
```

## TypeScript

Full TypeScript support included. All types are exported:

```typescript
import type { 
  SendCodeResult, 
  VerifyCodeResult,
  CheckPhoneResult,
  MeCaptchaClientOptions 
} from '@mecaptcha/verify-sdk';
```

## Platform Support

- ✅ Node.js 18+
- ✅ Browsers (modern)
- ✅ React Native
- ✅ Deno
- ✅ Bun

Uses native `fetch` API - no polyfills needed for modern environments.

## License

MIT



