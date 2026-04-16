# /format

> Auto-format code with project's formatter

## Description

Runs the project's code formatter (Prettier, Biome, etc.) on all files.

## Usage

```bash
/format
```

## Implementation

Checks for common formatters in this order:
1. `biome format`
2. `prettier --write`
3. `npm run format` / `pnpm format` / `yarn format`

## Example Output

```
🔍 Detected Biome formatter...
📦 Formatting 15 files...
✅ Format complete. No changes needed.
```

## Notes

- Safe to run multiple times (idempotent)
- Only formats files tracked by git (optional)
- Can be extended with `--check` flag for CI