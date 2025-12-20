# @mecaptcha/verify-react

React components for MeCaptcha SMS verification. Beautiful, accessible, and easy to integrate.

## Installation

```bash
npm install @mecaptcha/verify-react
# or
pnpm add @mecaptcha/verify-react
# or
yarn add @mecaptcha/verify-react
```

## Quick Start

```tsx
import { MeCaptcha } from '@mecaptcha/verify-react';

function App() {
  return (
    <MeCaptcha
      apiKey="mec_live_..."
      onVerify={(result) => {
        console.log('Verified!', result.creditsAwarded);
      }}
    />
  );
}
```

## Components

### `<MeCaptcha />`

Standalone verification component with full UI flow.

**Props:**
- `apiKey` (string, required) - Your MeCaptcha API key
- `onVerify` (function, required) - Called when verification succeeds
- `onError` (function, optional) - Called when errors occur
- `defaultCountryCode` (string, optional) - Default country code (default: "+1")
- `theme` (string, optional) - "light" | "dark" | "auto"
- `showBranding` (boolean, optional) - Show MeCaptcha logo (default: true)
- `phoneNumber` (string, optional) - External phone number (skips phone input, shows code input)
- `countryCode` (string, optional) - Country code when using external phone number
- `baseUrl` (string, optional) - Custom API base URL

**Ref Methods (when using external phone number):**
- `ref.current.sendCode()` - Send verification code to the phone number
- `ref.current.verifyCode(code: string)` - Verify a code manually

**Example:**
```tsx
<MeCaptcha
  apiKey="mec_live_..."
  onVerify={(result) => {
    console.log('Credits:', result.creditsAwarded);
    console.log('Has account:', result.hasMeCaptcha);
  }}
  onError={(error) => {
    console.error('Error:', error.message);
  }}
  defaultCountryCode="+44"
/>
```

### `<MeCaptchaProtect />`

Wrapper component that protects content until user is verified.

**Props:**
- `apiKey` (string, required) - Your MeCaptcha API key
- `children` (ReactNode, required) - Protected content
- `onVerified` (function, optional) - Called when verification succeeds
- `requireReauth` (number, optional) - Re-verify after X minutes
- `storageKey` (string, optional) - Session storage key (default: "mecaptcha_verified")

**Example:**
```tsx
<MeCaptchaProtect apiKey="mec_live_...">
  <ProtectedDashboard />
</MeCaptchaProtect>
```

## Hooks

### `useMeCaptchaVerify(apiKey, options?)`

Headless hook for building custom UIs.

**Returns:**
```typescript
{
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  countryCode: string;
  setCountryCode: (code: string) => void;
  code: string;
  setCode: (code: string) => void;
  step: "phone" | "code";
  isLoading: boolean;
  error: string | null;
  hasMeCaptcha: boolean;
  isVerified: boolean;
  resendCooldown: number;
  sendCode: () => Promise<void>;
  verifyCode: (code?: string) => Promise<void>;
  checkPhone: (phone?: string) => Promise<boolean>;
  reset: () => void;
  editNumber: () => void;
  getFullPhoneNumber: () => string;
}
```

**Example:**
```tsx
function CustomVerify() {
  const {
    phoneNumber,
    setPhoneNumber,
    sendCode,
    verifyCode,
    isLoading,
    error
  } = useMeCaptchaVerify('mec_live_...', {
    onVerify: (result) => console.log('Success!', result),
    onError: (error) => console.error('Error:', error),
  });

  return (
    <div>
      <input 
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={sendCode}>Send Code</button>
    </div>
  );
}
```

### `useMeCaptchaRef(options?)`

Hook to simplify using MeCaptcha with external phone number control. Provides validation helpers and convenient ref management.

**Options:**
- `phoneNumber` (string, optional) - Phone number to validate
- `countryCode` (string, optional) - Country code (default: "+1")

**Returns:**
```typescript
{
  ref: RefObject<MeCaptchaHandle>;
  isValidPhone: boolean;
  sendCode: () => Promise<void>;
  fullPhoneNumber: string | null;
}
```

**Example:**
```tsx
function MyComponent() {
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const { ref, isValidPhone, sendCode } = useMeCaptchaRef({
    phoneNumber,
    countryCode: '+1'
  });

  return (
    <>
      <input
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={sendCode} disabled={!isValidPhone}>
        Send Code
      </button>
      <MeCaptcha
        ref={ref}
        apiKey="mec_live_..."
        phoneNumber={phoneNumber}
        onVerify={handleVerify}
      />
    </>
  );
}
```

### `useMeCaptchaContext()`

Access verification state within `<MeCaptchaProtect>`.

**Returns:**
```typescript
{
  apiKey: string;
  isVerified: boolean;
  verificationResult?: VerifyCodeResult;
}
```

**Example:**
```tsx
function ProtectedContent() {
  const { verificationResult } = useMeCaptchaContext();
  
  return (
    <div>
      <p>Credits earned: {verificationResult?.creditsAwarded}</p>
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

## Styling

Components use inline styles with theme support. Colors adapt to system dark mode automatically.

**Custom Theme (coming soon):**
```tsx
<MeCaptcha
  apiKey="mec_live_..."
  theme="dark"
  onVerify={handleVerify}
/>
```

## Features

✅ **Phone Input** - Country code selector + formatted input  
✅ **Code Input** - 6-digit input with auto-focus  
✅ **Auto-submit** - Submits when 6 digits entered  
✅ **Paste Support** - Paste 6-digit codes  
✅ **Resend Logic** - 60-second cooldown  
✅ **Download Prompt** - Shown for non-MeCaptcha users  
✅ **Session Persistence** - Survives page refresh  
✅ **Dark Mode** - Auto-detects system preference  
✅ **Accessible** - ARIA labels, keyboard navigation  
✅ **Mobile Friendly** - Responsive design  
✅ **External Phone Control** - Use your own phone input, MeCaptcha handles code verification  
✅ **React 18 & 19 Support** - Works with both versions  

## TypeScript

Full TypeScript support included:

```typescript
import type { 
  MeCaptchaProps,
  MeCaptchaProtectProps,
  VerifyCodeResult 
} from '@mecaptcha/verify-react';
```

## Examples

See the [examples](../../examples) directory:
- [Basic React](../../examples/basic-react) - Simple integration
- [Protect Wrapper](../../examples/protect-wrapper) - Protected content

## License

MIT



