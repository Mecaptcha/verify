# Version Management with Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to automatically manage version numbers and changelogs. **You no longer need to manually update version numbers in package.json files!**

## How It Works

1. **When you make changes**: Create a changeset describing what changed
2. **Before releasing**: Run `pnpm version` to automatically bump versions and generate changelogs
3. **When publishing**: Run `pnpm release` to build and publish packages

## Workflow

### 1. Making Changes

After making code changes, create a changeset:

```bash
pnpm changeset
```

This will:
- Ask which packages changed
- Ask what type of change (patch, minor, major)
- Ask for a description
- Create a changeset file in `.changeset/`

**Example:**
```bash
$ pnpm changeset
🦋  Which packages would you like to include?
✔ Changed packages: @mecaptcha/verify-react
✔ Is this a major, minor, or patch change? … patch
✔ Please enter a summary for this change: … Fixed code validation bug
```

This creates a file like `.changeset/cool-cats-sing.md` with your change description.

### 2. Committing Changes

Commit your code changes AND the changeset file:

```bash
git add .
git commit -m "fix: code validation bug"
git push
```

### 3. Versioning (Before Release)

When you're ready to release, run:

```bash
pnpm run version:changeset
```

**Note**: Use `pnpm run version:changeset` (not `pnpm version`) because `pnpm version` is a built-in command.

This will:
- ✅ Read all changeset files
- ✅ Automatically bump version numbers in `package.json` files
- ✅ Generate/update `CHANGELOG.md` files
- ✅ Delete the changeset files
- ✅ Create a commit with version bumps

**You can review the changes before committing:**
```bash
pnpm run version:changeset
# Review the changes
git add .
git commit -m "chore: version packages"
```

### 4. Publishing

After versioning, publish to npm:

```bash
pnpm release
```

This will:
- Build all packages
- Publish to npm with `--access public`
- Create git tags

Or manually:
```bash
pnpm build
pnpm -r publish --access public
```

## Version Types

When creating a changeset, you choose:

- **Patch** (0.1.0 → 0.1.1): Bug fixes, small changes
- **Minor** (0.1.0 → 0.2.0): New features, backward compatible
- **Major** (0.1.0 → 1.0.0): Breaking changes

## Example Workflow

```bash
# 1. Make code changes
# ... edit files ...

# 2. Create changeset
pnpm changeset
# Select: @mecaptcha/verify-react
# Type: patch
# Summary: "Fixed phone number validation"

# 3. Commit
git add .
git commit -m "fix: phone number validation"
git push

# 4. When ready to release
pnpm version
git add .
git commit -m "chore: version packages"
git push

# 5. Publish
pnpm release
```

## Multiple Packages

If you change multiple packages:

```bash
pnpm changeset
# Select: @mecaptcha/verify-sdk, @mecaptcha/verify-react
# Type: minor
# Summary: "Added new verification endpoint"
```

Changesets will handle versioning both packages appropriately.

## Benefits

✅ **No manual version management** - versions are automatically calculated  
✅ **Automatic changelogs** - generated from changeset descriptions  
✅ **Consistent versioning** - follows semantic versioning rules  
✅ **Multiple packages** - handles monorepo versioning automatically  
✅ **Git integration** - creates commits and tags automatically  

## Advanced: Linking Packages

If you want packages to always version together, add them to `linked` in `.changeset/config.json`:

```json
{
  "linked": [["@mecaptcha/verify-sdk", "@mecaptcha/verify-react"]]
}
```

However, since React bundles the SDK, you probably want to version them independently.

## Troubleshooting

**"No changesets found"**: Run `pnpm changeset` to create one first

**"Package already published"**: The version already exists on npm, changesets will skip it

**"Access denied"**: Make sure you're logged into npm (`npm login`) and have access to `@mecaptcha` org

