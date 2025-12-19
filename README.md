# MeCaptcha Verify

SMS-based 2FA verification with humanity credits. A privacy-focused alternative to Twilio Verify, Firebase Auth, and other SMS verification services.

## Features

- 🔐 **SMS Verification** - Secure phone-based 2FA
- 🌟 **Humanity Credits** - Users with MeCaptcha accounts earn credits
- 🎨 **Beautiful UI** - Pre-built React components with MeCaptcha branding
- 🔧 **Headless SDK** - Build your own UI
- 📱 **Mobile Ready** - Responsive design
- 🚀 **Easy Integration** - Get started in < 5 minutes
- 🔒 **Privacy First** - No tracking, no data collection

## Packages

This monorepo contains two npm packages:

### [@mecaptcha/verify-sdk](./packages/sdk)

Headless TypeScript SDK for SMS verification.

```bash
npm install @mecaptcha/verify-sdk
```

```typescript
import { MeCaptchaClient } from '@mecaptcha/verify-sdk';

const client = new MeCaptchaClient('mec_live_...');
await client.sendCode('+15551234567');
await client.verifyCode('+15551234567', '123456');
```

### [@mecaptcha/verify-react](./packages/react)

Pre-built React components with MeCaptcha branding.

```bash
npm install @mecaptcha/verify-react
```

```tsx
import { MeCaptcha } from '@mecaptcha/verify-react';

<MeCaptcha 
  apiKey="mec_live_..."
  onVerify={(result) => console.log('Verified!', result)}
/>
```

## Quick Start

1. **Get an API key** from [MeCaptcha Dashboard](https://mecaptcha.com/dashboard)
   
   **Or use the demo key for testing:**
   - API Key: `demo`
   - Test Phone: `+18025551212`
   - Test Code: `123456`
   
   The demo key only works with the test phone number and code above.

2. **Install the package:**
```bash
npm install @mecaptcha/verify-react
```

3. **Add to your app:**
```tsx
import { MeCaptcha } from '@mecaptcha/verify-react';

function App() {
  return (
    <MeCaptcha 
      apiKey="mec_live_..." // or "demo" for testing
      onVerify={(result) => {
        // User verified! Proceed with protected action
        console.log('Credits awarded:', result.creditsAwarded);
      }}
    />
  );
}
```

## Examples

- [Basic React App](./examples/basic-react)
- [Protect Wrapper](./examples/protect-wrapper)

## Documentation

- [Getting Started](./docs/getting-started.md)
- [API Reference](./docs/api-reference.md)
- [Component Documentation](./docs/components.md)

## Why MeCaptcha Verify?

### vs Twilio Verify
- ✅ Simpler integration
- ✅ Humanity credits reward system
- ✅ Pre-built UI components

### vs Firebase Auth
- ✅ No vendor lock-in
- ✅ Privacy-focused
- ✅ Reward users for verification

### vs Auth0
- ✅ More affordable
- ✅ Open source
- ✅ Self-contained (no complex dashboards)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## License

MIT License - see [LICENSE](./LICENSE)

## Support

- 📧 Email: support@mecaptcha.com
- 🐛 Issues: [GitHub Issues](https://github.com/Mecaptcha/verify/issues)
- 💬 Discord: [MeCaptcha Community](https://discord.gg/mecaptcha)



