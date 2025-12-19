# Component Documentation

Detailed documentation for all React components in `@mecaptcha/verify-react`.

## `<MeCaptcha />`

Standalone verification component with complete UI flow.

### Basic Usage

```tsx
<MeCaptcha
  apiKey="mec_live_..."
  onVerify={(result) => {
    console.log('Verified!', result);
  }}
/>
```

### All Props

```typescript
interface MeCaptchaProps {
  apiKey: string;
  onVerify: (result: VerifyCodeResult) => void;
  onError?: (error: Error) => void;
  defaultCountryCode?: string;
  theme?: "light" | "dark" | "auto";
  showBranding?: boolean;
}
```

**Props:**

- **`apiKey`** (required)
  - Type: `string`
  - Your MeCaptcha API key
  - Must start with `mec_live_` or `mec_test_`

- **`onVerify`** (required)
  - Type: `(result: VerifyCodeResult) => void`
  - Called when verification succeeds
  - Receives credits awarded and account status

- **`onError`** (optional)
  - Type: `(error: Error) => void`
  - Called when errors occur
  - Handle and display errors to user

- **`defaultCountryCode`** (optional)
  - Type: `string`
  - Default: `"+1"`
  - Initial country code selection

- **`theme`** (optional)
  - Type: `"light" | "dark" | "auto"`
  - Default: `"auto"` (follows system preference)
  - Force light or dark theme

- **`showBranding`** (optional)
  - Type: `boolean`
  - Default: `true`
  - Show "Powered by MeCaptcha" footer

### User Flow

1. **Phone Entry**
   - Select country code
   - Enter phone number
   - Click "Send Code"

2. **Code Entry**
   - Receive SMS
   - Enter 6-digit code
   - Auto-submits when complete

3. **Verification Complete**
   - `onVerify()` called
   - Credits awarded if applicable
   - App proceeds with logic

### Examples

**With Error Handling:**
```tsx
<MeCaptcha
  apiKey="mec_live_..."
  onVerify={(result) => {
    if (result.creditsAwarded > 0) {
      showNotification(`You earned ${result.creditsAwarded} credits!`);
    }
    navigateToProtectedArea();
  }}
  onError={(error) => {
    showErrorMessage(error.message);
  }}
/>
```

**Custom Country Code:**
```tsx
<MeCaptcha
  apiKey="mec_live_..."
  onVerify={handleVerify}
  defaultCountryCode="+44"  // UK
/>
```

**Dark Theme:**
```tsx
<MeCaptcha
  apiKey="mec_live_..."
  onVerify={handleVerify}
  theme="dark"
/>
```

## `<MeCaptchaProtect />`

Wrapper component that protects content until verified.

### Basic Usage

```tsx
<MeCaptchaProtect apiKey="mec_live_...">
  <ProtectedDashboard />
</MeCaptchaProtect>
```

### All Props

```typescript
interface MeCaptchaProtectProps {
  apiKey: string;
  children: React.ReactNode;
  onVerified?: (result: VerifyCodeResult) => void;
  requireReauth?: number;
  storageKey?: string;
}
```

**Props:**

- **`apiKey`** (required)
  - Type: `string`
  - Your MeCaptcha API key

- **`children`** (required)
  - Type: `React.ReactNode`
  - Protected content (only shown after verification)

- **`onVerified`** (optional)
  - Type: `(result: VerifyCodeResult) => void`
  - Called when user completes verification

- **`requireReauth`** (optional)
  - Type: `number`
  - Require re-verification after X minutes
  - Default: no re-auth (persists in session)

- **`storageKey`** (optional)
  - Type: `string`
  - Default: `"mecaptcha_verified"`
  - SessionStorage key for persistence

### Behavior

**Before Verification:**
- Shows `<MeCaptcha />` component
- Children are hidden

**After Verification:**
- Hides verification UI
- Shows children
- Stores state in sessionStorage
- Provides verification result via context

### Examples

**Basic Protection:**
```tsx
<MeCaptchaProtect apiKey="mec_live_...">
  <AdminDashboard />
</MeCaptchaProtect>
```

**With Callback:**
```tsx
<MeCaptchaProtect
  apiKey="mec_live_..."
  onVerified={(result) => {
    trackEvent('user_verified', {
      credits: result.creditsAwarded,
    });
  }}
>
  <ProtectedContent />
</MeCaptchaProtect>
```

**Require Re-auth:**
```tsx
<MeCaptchaProtect
  apiKey="mec_live_..."
  requireReauth={30}  // Re-verify after 30 minutes
>
  <SensitiveContent />
</MeCaptchaProtect>
```

**Custom Storage Key:**
```tsx
<MeCaptchaProtect
  apiKey="mec_live_..."
  storageKey="my_app_verification"
>
  <ProtectedContent />
</MeCaptchaProtect>
```

### Context API

Use `useMeCaptchaContext()` inside protected content:

```tsx
import { MeCaptchaProtect, useMeCaptchaContext } from '@mecaptcha/verify-react';

function ProtectedContent() {
  const { verificationResult } = useMeCaptchaContext();
  
  return (
    <div>
      <p>Credits: {verificationResult?.creditsAwarded}</p>
    </div>
  );
}

function App() {
  return (
    <MeCaptchaProtect apiKey="mec_live_...">
      <ProtectedContent />
    </MeCaptchaProtect>
  );
}
```

## Hooks

### `useMeCaptchaVerify()`

See [Getting Started](./getting-started.md) for usage.

### `useMeCaptchaContext()`

Access verification state within `<MeCaptchaProtect>`.

## Response Types

All response types are fully typed:

```typescript
import type {
  SendCodeResult,
  VerifyCodeResult,
  CheckPhoneResult,
} from '@mecaptcha/verify-sdk';
```

## Error Classes

All error classes extend `MeCaptchaError`:

```typescript
import {
  MeCaptchaError,
  InvalidApiKeyError,
  InvalidCodeError,
  InvalidPhoneError,
  RateLimitError,
  NetworkError,
  ServerError,
} from '@mecaptcha/verify-sdk';
```

## Backend API

The SDK calls these backend endpoints:

**Base URL:** `https://api.mecaptcha.com/v1` (configurable via `baseUrl` prop or `MECAPTCHA_BASE_URL` environment variable)

**Authentication:** `Authorization: Bearer {apiKey}` header

### Endpoints

1. **POST /send-verification-code**
   - Body: `{ phoneNumber: string }`
   - Response: `{ success: boolean, hasMeCaptcha: boolean }`

2. **POST /verify-code**
   - Body: `{ phoneNumber: string, code: string }`
   - Response: `{ success: boolean, creditsAwarded: number, hasMeCaptcha: boolean }`

3. **POST /check-phone**
   - Body: `{ phoneNumber: string }`
   - Response: `{ hasMeCaptcha: boolean }`

## Best Practices

### 1. Always Handle Errors

```tsx
<MeCaptcha
  apiKey="mec_live_..."
  onVerify={handleVerify}
  onError={(error) => {
    // Show user-friendly error message
    showToast(error.message);
  }}
/>
```

### 2. Show Download Prompt

When `hasMeCaptcha: false`, encourage users to download the app:

```tsx
const handleVerify = (result) => {
  if (!result.hasMeCaptcha) {
    showModal('Download MeCaptcha to earn credits!');
  }
};
```

### 3. Track Credit Awards

```tsx
const handleVerify = (result) => {
  if (result.creditsAwarded > 0) {
    analytics.track('credits_awarded', {
      amount: result.creditsAwarded,
    });
  }
};
```

### 4. Session Persistence

Use `<MeCaptchaProtect>` for automatic session management:

```tsx
<MeCaptchaProtect apiKey="mec_live_...">
  {/* Content persists across page refreshes */}
  <Dashboard />
</MeCaptchaProtect>
```

## See Also

- [Getting Started](./getting-started.md)
- [Examples](../examples)
- [GitHub Repository](https://github.com/Mecaptcha/verify)



