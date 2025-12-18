# Getting Started with MeCaptcha Verify

## What is MeCaptcha Verify?

MeCaptcha Verify is an SMS-based 2FA service that rewards users with humanity credits. It's a privacy-focused alternative to Twilio Verify, Firebase Auth, and similar services.

## Prerequisites

- Node.js 18 or higher
- A MeCaptcha API key (get one at [mecaptcha.com/dashboard](https://mecaptcha.com/dashboard))

## Installation

### Option 1: React Components (Recommended)

For most users, install the React package:

```bash
npm install @mecaptcha/verify-react
```

This includes the SDK automatically.

### Option 2: Headless SDK

For custom UIs or non-React projects:

```bash
npm install @mecaptcha/verify-sdk
```

## Quick Start: React

### Step 1: Import

```tsx
import { MeCaptcha } from '@mecaptcha/verify-react';
```

### Step 2: Add Component

```tsx
function App() {
  return (
    <MeCaptcha
      apiKey="mec_live_..."
      onVerify={(result) => {
        console.log('User verified!');
        console.log('Credits awarded:', result.creditsAwarded);
      }}
    />
  );
}
```

### Step 3: Handle Verification

```tsx
function App() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = (result) => {
    setIsVerified(true);
    
    if (result.creditsAwarded > 0) {
      console.log(`User earned ${result.creditsAwarded} humanity credits!`);
    }
    
    // Proceed with your app logic
    proceedToProtectedArea();
  };

  return (
    <div>
      {!isVerified ? (
        <MeCaptcha apiKey="mec_live_..." onVerify={handleVerify} />
      ) : (
        <ProtectedContent />
      )}
    </div>
  );
}
```

## Quick Start: Protect Wrapper

For protecting entire sections:

```tsx
import { MeCaptchaProtect } from '@mecaptcha/verify-react';

function App() {
  return (
    <MeCaptchaProtect apiKey="mec_live_...">
      <ProtectedDashboard />
    </MeCaptchaProtect>
  );
}
```

The wrapper:
- Shows verification UI if not verified
- Hides content until verified
- Persists verification state
- Handles re-authentication

## Quick Start: Headless SDK

For custom UIs:

```typescript
import { MeCaptchaClient } from '@mecaptcha/verify-sdk';

const client = new MeCaptchaClient('mec_live_...');

// Send code
await client.sendCode('+15551234567');

// Verify code
const result = await client.verifyCode('+15551234567', '123456');
console.log('Credits:', result.creditsAwarded);
```

## Understanding the Flow

### 1. User Enters Phone Number

```
┌─────────────────┐
│ Enter Phone:    │
│ +1 (555) 123-   │
│ 4567            │
│                 │
│ [Send Code]     │
└─────────────────┘
```

### 2. SMS Code Sent

- Code sent via SMS
- Check if phone has MeCaptcha account
- Show download prompt if no account

### 3. User Enters Code

```
┌─────────────────┐
│ Enter code sent │
│ to +1 555-123-  │
│ 4567:           │
│                 │
│ [1][2][3][4][5] │
│ [6]             │
│                 │
│ Resend code     │
└─────────────────┘

💡 Download MeCaptcha
to earn humanity credits!
```

### 4. Verification Complete

- Code validated
- Credits awarded (if MeCaptcha user)
- `onVerify()` callback called
- User proceeds to protected content

## Next Steps

- [API Reference](./api-reference.md) - Full API documentation
- [Component Guide](./components.md) - Detailed component docs
- [Examples](../examples) - Working code examples

## Getting an API Key

1. Sign up at [mecaptcha.com](https://mecaptcha.com)
2. Go to Dashboard → API Keys
3. Create a new key
4. Use `mec_live_` keys for production
5. Use `mec_test_` keys for development

## Support

- Email: support@mecaptcha.com
- Issues: [GitHub Issues](https://github.com/Mecaptcha/verify/issues)
- Discord: [MeCaptcha Community](https://discord.gg/mecaptcha)



