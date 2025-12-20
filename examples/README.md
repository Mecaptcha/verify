# MeCaptcha Verify Examples

This directory contains example applications demonstrating how to use the MeCaptcha Verify library.

## Available Examples

### 1. Basic React Example

A simple example showing the `<MeCaptcha />` component in action.

**Location:** `basic-react/`

**Features:**
- Phone number input with country code
- SMS code verification
- Success/error handling
- Download prompt for non-MeCaptcha users

**Run:**
```bash
cd examples/basic-react
pnpm install
pnpm dev
```

Then open http://localhost:5173 in your browser.

**Demo Credentials:**
- API Key: `demo`
- Phone: `+18025551212`
- Code: `123456`

### 2. External Phone Example

An example showing how to use MeCaptcha with an external phone number input.

**Location:** `external-phone/`

**Features:**
- External phone number collection (outside MeCaptcha)
- `useMeCaptchaRef` hook for easy integration
- Phone validation helpers
- MeCaptcha handles only code sending and verification
- No race conditions - phone can change freely

**Run:**
```bash
cd examples/external-phone
pnpm install
pnpm dev
```

Then open http://localhost:5173 in your browser.

**Use Case:**
- Your app collects phone number (e.g., during signup)
- MeCaptcha sends verification code
- MeCaptcha shows code input screen
- MeCaptcha calls `onVerify` when verified

### 3. Protect Wrapper Example

An example showing the `<MeCaptchaProtect />` wrapper component that hides content until verified.

**Location:** `protect-wrapper/`

**Features:**
- Automatic verification flow
- Protected content only shown after verification
- Session persistence (survives page refresh)
- Context API for accessing verification state
- Sign out functionality

**Run:**
```bash
cd examples/protect-wrapper
pnpm install
pnpm dev
```

Then open http://localhost:5173 in your browser.

## Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm/yarn

## Quick Start

1. **Install dependencies** (from repo root):
   ```bash
   pnpm install
   ```

2. **Build the packages** (from repo root):
   ```bash
   pnpm build
   ```

3. **Run an example**:
   ```bash
   cd examples/basic-react
   pnpm install
   pnpm dev
   ```

## Using Your Own API Key

To use your own API key instead of the demo key:

1. Get an API key from [MeCaptcha Dashboard](https://mecaptcha.com/dashboard)
2. Update the `apiKey` prop in the example's `App.tsx` file:
   ```tsx
   <MeCaptcha apiKey="mec_live_your_key_here" ... />
   ```

## Troubleshooting

If you see build errors, make sure you've:
1. Installed dependencies at the repo root: `pnpm install`
2. Built the packages: `pnpm build`
3. Installed example dependencies: `cd examples/basic-react && pnpm install`

