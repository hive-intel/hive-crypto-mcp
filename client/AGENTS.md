# MCP Client Package Guidelines

This package is the typed TypeScript adapter for app developers. It inherits the
root `AGENTS.md` rules and adds package-specific API stability expectations.

## Contract

- Preserve the discovery -> schema -> invoke flow as the default integration
  path.
- Never encourage browser-side Hive API key usage. Keep examples server-side.
- Keep provenance, `_hive`, `meta`, source, freshness, cache, and runtime status
  available to callers.
- Treat exported types and helper names as public API once documented.
- Avoid hiding MCP errors behind generic exceptions when classified status can
  be preserved.

## Verification

Use package-local checks while iterating:

```bash
npm --workspace hive-mcp-client run typecheck
npm --workspace hive-mcp-client run test
npm --workspace hive-mcp-client run build
```

Run root checks when changes affect shared MCP contracts or metadata:

```bash
npm run test:mcp-compliance
npm run check
```
