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

### 2. Protect Wrapper Example

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

