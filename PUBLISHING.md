# Publishing Guide

This guide covers the process for publishing the `@mecaptcha/verify-sdk` and `@mecaptcha/verify-react` packages to npm.

## Prerequisites

1. **npm Account**: Ensure you have an npm account and are a member of the `@mecaptcha` organization
2. **Authentication**: Log in to npm from your terminal:
   ```bash
   npm login
   ```
3. **Build**: Ensure all packages are built and tests pass:
   ```bash
   pnpm build
   pnpm test
   ```

## Publishing Process

### 1. Version Management

**This project uses Changesets for automatic version management!** See [VERSIONING.md](./VERSIONING.md) for details.

**Quick version workflow:**
1. Make changes and create a changeset: `pnpm changeset`
2. Commit changes and changeset file
3. When ready to release: `pnpm version` (automatically bumps versions)
4. Publish: `pnpm release` (builds and publishes)

**No manual version updates needed!** Changesets automatically:
- Calculates version bumps based on changeset types
- Updates `package.json` files
- Generates changelogs
- Handles multiple packages

### 2. Publishing with pnpm

**Important**: The `@mecaptcha/verify-react` package **bundles** the SDK code directly into its build output. This means:

- ✅ **No dependency version management needed** - React package is self-contained
- ✅ **Publish in any order** - React doesn't depend on the published SDK version
- ✅ **Simpler publishing workflow**

You can publish packages independently:

```bash
# Publish SDK (optional - can be used standalone)
cd packages/sdk
pnpm publish --access public

# Publish React (includes bundled SDK, no dependency needed)
cd packages/react
pnpm publish --access public
```

**Note**: The React package bundles the SDK during build, so consumers don't need to install `@mecaptcha/verify-sdk` separately when using `@mecaptcha/verify-react`.

### 3. Recommended Workflow

#### Option A: Using Changesets (Recommended)

1. **Create a changeset** for your changes:
   ```bash
   pnpm changeset
   # Select packages, choose version type, add description
   ```

2. **Commit your changes**:
   ```bash
   git add .
   git commit -m "your commit message"
   git push
   ```

3. **Version packages** (when ready to release):
   ```bash
   pnpm version
   # This automatically bumps versions and generates changelogs
   git add .
   git commit -m "chore: version packages"
   git push
   ```

4. **Publish**:
   ```bash
   pnpm release
   # Or manually: pnpm build && pnpm -r publish --access public
   ```

**Benefits:**
- ✅ No manual version management
- ✅ Automatic changelog generation
- ✅ Handles multiple packages correctly
- ✅ Follows semantic versioning

#### Option B: Manual Publishing (Not Recommended)

If you need to publish manually without changesets:

1. **Manually update versions** in `package.json` files
2. **Build and test**:
   ```bash
   pnpm build
   pnpm test
   ```
3. **Publish packages**:
   ```bash
   pnpm -r publish --access public
   ```

#### Option B: Using pnpm's Versioning (Recommended)

pnpm can handle versioning and publishing automatically:

1. **Install changeset or use pnpm version**:
   ```bash
   # Update versions interactively
   pnpm -r version
   ```

2. **Publish with pnpm**:
   ```bash
   # This will publish all packages that have changed
   pnpm -r publish --access public
   ```

### 4. Publishing Flags

- `--access public`: Required for scoped packages (`@mecaptcha/*`) on public npm
- `--dry-run`: Test the publish process without actually publishing
- `--tag`: Publish with a specific tag (default: `latest`)
  ```bash
  pnpm publish --tag beta
  ```

### 5. Post-Publishing

After publishing:

1. **Create a git tag**:
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```

2. **No dependency updates needed** - The SDK is bundled into React, so the workspace dependency is only for development/type checking.

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "chore: publish v0.1.0"
   git push
   ```

## Automated Publishing (Future)

Consider setting up automated publishing with:

1. **GitHub Actions**: Trigger on version tags or releases
2. **Changesets**: Manage versioning and changelogs automatically
3. **Semantic Release**: Automated versioning based on commit messages

Example GitHub Actions workflow:

```yaml
name: Publish

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm test
      - run: pnpm -r publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Troubleshooting

### Authentication Issues

**"Access token expired or revoked"** or **"E404"**:

#### Option 1: Using npm login (Interactive)

1. **Log in to npm**:
   ```bash
   npm login
   ```
   Enter your npm username, password, and email when prompted.

2. **Verify you're logged in**:
   ```bash
   npm whoami
   ```
   Should show your npm username.

3. **Check organization access**:
   ```bash
   npm org ls mecaptcha
   ```
   Ensure you're a member of the `@mecaptcha` organization.

#### Option 2: Using Access Token (Recommended for CI/CD and 2FA)

**Step 1: Create an Access Token**

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click **"Generate New Token"**
3. Choose token type:
   - **Automation** (recommended for CI/CD) - doesn't expire
   - **Publish** - for publishing packages
   - **Read-only** - for reading packages
4. Copy the token immediately (you won't be able to see it again!)

**Step 2: Configure npm to use the token**

You have several options:

**Option A: Set token in `.npmrc` file (Recommended)**

Create or edit `~/.npmrc` (or `.npmrc` in your project root):

```bash
# In your home directory (~/.npmrc) or project root (.npmrc)
echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE" >> ~/.npmrc
```

Or manually edit `~/.npmrc`:
```
//registry.npmjs.org/:_authToken=npm_YOUR_TOKEN_HERE
```

**Option B: Use environment variable**

```bash
export NPM_TOKEN=YOUR_TOKEN_HERE
```

Then create/update `.npmrc`:
```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

**Option C: Use npm config command**

```bash
npm config set //registry.npmjs.org/:_authToken YOUR_TOKEN_HERE
```

**Step 3: Verify token works**

```bash
npm whoami
# Should show your username
```

**Step 4: Publish**

```bash
pnpm -r publish --access public
```

**Security Note**: 
- Never commit tokens to git
- Add `.npmrc` to `.gitignore` if it contains tokens
- Use environment variables in CI/CD
- For automation tokens, use `NPM_TOKEN` environment variable

### Other Common Issues

- **"Package name already exists"**: Version already published, increment version or use changesets
- **"You do not have permission"**: Ensure you're logged in and have access to `@mecaptcha` org
- **Build errors**: Ensure SDK is built before building React (for type checking), but bundling happens automatically
- **"workspace:* dependency"**: This is fine - the SDK is bundled, so it's only needed for dev

## Current Package Status

- `@mecaptcha/verify-sdk`: v0.1.0 (standalone package)
- `@mecaptcha/verify-react`: v0.1.0 (self-contained, bundles SDK code)

## How Bundling Works

The React package uses `tsup` with a configuration that:
- Bundles `@mecaptcha/verify-sdk` directly into the output
- Externalizes only `react` and `react-dom` (peer dependencies)
- Creates a self-contained package that doesn't require the SDK as a runtime dependency

This means:
- ✅ Consumers only need to install `@mecaptcha/verify-react`
- ✅ No version coordination between SDK and React packages
- ✅ Simpler publishing workflow
- ✅ Smaller total bundle size (no duplicate dependencies)

