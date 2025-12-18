# API Reference

Complete API documentation for MeCaptcha Verify SDK and React components.

## SDK (@mecaptcha/verify-sdk)

### `MeCaptchaClient`

Main client class for interacting with the MeCaptcha Verify API.

#### Constructor

```typescript
new MeCaptchaClient(apiKey: string, options?: MeCaptchaClientOptions)
```

**Parameters:**
- `apiKey` (string, required) - Your MeCaptcha API key (starts with `mec_live_` or `mec_test_`)
- `options` (object, optional)
  - `baseUrl` (string) - Custom API base URL (default: production URL)

**Throws:**
- `Error` if API key is missing or invalid format

**Example:**
```typescript
const client = new MeCaptchaClient('mec_live_abc123');
```

#### `sendCode(phoneNumber: string): Promise<SendCodeResult>`

Sends a 6-digit verification code via SMS.

**Parameters:**
- `phoneNumber` (string) - Phone number in E.164 format (e.g., "+15551234567")

**Returns:**
```typescript
{
  success: boolean;      // Always true if no error thrown
  hasMeCaptcha: boolean; // True if phone has MeCaptcha account
}
```

**Throws:**
- `InvalidPhoneError` - Phone number is invalid or improperly formatted
- `InvalidApiKeyError` - API key is invalid or inactive
- `RateLimitError` - Too many requests
- `NetworkError` - Network failure (after retries)
- `ServerError` - Server-side error

**Example:**
```typescript
try {
  const result = await client.sendCode('+15551234567');
  if (result.hasMeCaptcha) {
    console.log('User will earn credits!');
  }
} catch (error) {
  if (error instanceof InvalidPhoneError) {
    alert('Invalid phone number');
  }
}
```

#### `verifyCode(phoneNumber: string, code: string): Promise<VerifyCodeResult>`

Verifies the SMS code and awards credits if applicable.

**Parameters:**
- `phoneNumber` (string) - Phone number in E.164 format
- `code` (string) - 6-digit code received via SMS

**Returns:**
```typescript
{
  success: boolean;         // Always true if no error thrown
  creditsAwarded: number;   // 0-5 credits (daily limit)
  hasMeCaptcha: boolean;    // True if phone has MeCaptcha account
}
```

**Throws:**
- `InvalidCodeError` - Code is incorrect or expired
- `InvalidPhoneError` - Phone number is invalid
- `InvalidApiKeyError` - API key is invalid or inactive
- `RateLimitError` - Too many attempts
- `NetworkError` - Network failure (after retries)
- `ServerError` - Server-side error

**Example:**
```typescript
try {
  const result = await client.verifyCode('+15551234567', '123456');
  console.log('Credits awarded:', result.creditsAwarded);
  
  if (result.creditsAwarded === 0 && result.hasMeCaptcha) {
    console.log('Already credited today');
  }
} catch (error) {
  if (error instanceof InvalidCodeError) {
    alert('Wrong code. Try again.');
  }
}
```

#### `checkPhone(phoneNumber: string): Promise<CheckPhoneResult>`

Checks if a phone number has a MeCaptcha account without sending SMS.

**Parameters:**
- `phoneNumber` (string) - Phone number in E.164 format

**Returns:**
```typescript
{
  hasMeCaptcha: boolean; // True if phone has MeCaptcha account
}
```

**Throws:**
- `InvalidPhoneError` - Phone number is invalid
- `InvalidApiKeyError` - API key is invalid or inactive
- `NetworkError` - Network failure
- `ServerError` - Server-side error

**Example:**
```typescript
const result = await client.checkPhone('+15551234567');
if (!result.hasMeCaptcha) {
  showDownloadPrompt();
}
```

## React Components (@mecaptcha/verify-react)

### `<MeCaptcha />`

See [Components Guide](./components.md#mecaptcha) for detailed documentation.

### `<MeCaptchaProtect />`

See [Components Guide](./components.md#mecaptchaprotect) for detailed documentation.

### Hooks

#### `useMeCaptchaVerify(apiKey: string, options?: UseMeCaptchaVerifyOptions)`

Custom hook for building verification flows.

**Parameters:**
- `apiKey` (string) - Your MeCaptcha API key
- `options` (object, optional)
  - `onVerify` (function) - Called when verification succeeds
  - `onError` (function) - Called when errors occur

**Returns:** Object with state and methods (see full type above)

**Example:**
```tsx
function CustomVerify() {
  const {
    phoneNumber,
    setPhoneNumber,
    sendCode,
    isLoading,
  } = useMeCaptchaVerify('mec_live_...');

  return (
    <div>
      <input 
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        disabled={isLoading}
      />
      <button onClick={sendCode}>Send</button>
    </div>
  );
}
```

#### `useMeCaptchaContext()`

Access verification state within `<MeCaptchaProtect>`.

**Returns:**
```typescript
{
  apiKey: string;
  isVerified: boolean;
  verificationResult?: VerifyCodeResult;
}
```

**Throws:**
- Error if used outside `<MeCaptchaProtect>`

**Example:**
```tsx
function ProtectedContent() {
  const { verificationResult } = useMeCaptchaContext();
  
  return (
    <p>You earned {verificationResult?.creditsAwarded} credits!</p>
  );
}
```

## Error Handling

All errors extend `MeCaptchaError`:

```typescript
class MeCaptchaError extends Error {
  code: string;      // Error code (e.g., "INVALID_CODE")
  statusCode?: number; // HTTP status code
}
```

### Error Types

| Error | Code | Status | Description |
|-------|------|--------|-------------|
| `InvalidApiKeyError` | `INVALID_API_KEY` | 401 | API key is invalid or inactive |
| `InvalidCodeError` | `INVALID_CODE` | 400 | Verification code is wrong/expired |
| `InvalidPhoneError` | `INVALID_PHONE` | 400 | Phone number is malformed |
| `RateLimitError` | `RATE_LIMIT` | 429 | Too many requests |
| `NetworkError` | `NETWORK_ERROR` | - | Network failure (after retries) |
| `ServerError` | `SERVER_ERROR` | 500 | Server-side error |

### Error Handling Pattern

```typescript
import {
  InvalidCodeError,
  RateLimitError,
  NetworkError,
} from '@mecaptcha/verify-sdk';

try {
  const result = await client.verifyCode(phone, code);
} catch (error) {
  if (error instanceof InvalidCodeError) {
    showError('Wrong code. Please try again.');
  } else if (error instanceof RateLimitError) {
    showError('Too many attempts. Wait a moment.');
  } else if (error instanceof NetworkError) {
    showError('Network error. Check your connection.');
  } else {
    showError('Unexpected error. Please try again.');
  }
}
```

## Types

### `SendCodeResult`

```typescript
interface SendCodeResult {
  success: boolean;
  hasMeCaptcha: boolean;
}
```

### `VerifyCodeResult`

```typescript
interface VerifyCodeResult {
  success: boolean;
  creditsAwarded: number;  // 0-5 credits
  hasMeCaptcha: boolean;
}
```

### `CheckPhoneResult`

```typescript
interface CheckPhoneResult {
  hasMeCaptcha: boolean;
}
```

## Rate Limits

- **Send Code:** 30 requests per hour per phone number
- **Verify Code:** 5 attempts per phone number per code
- **Check Phone:** 100 requests per hour per API key

## Credit Awarding

Credits are awarded once per day per phone number:

- **First verification of the day:** 5 credits
- **Subsequent verifications:** 0 credits
- **Reset:** UTC midnight

Only users with MeCaptcha accounts receive credits.

## Support

- Email: support@mecaptcha.com
- GitHub: [github.com/Mecaptcha/verify](https://github.com/Mecaptcha/verify)



