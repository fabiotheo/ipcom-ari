# IPCOM ARI Client Development Guide

## Commands
- Build: `npm run build` (generates ESM/CJS outputs with esbuild)
- Docs: `npm run docs` (generates TypeDoc API documentation)
- Publish: `npm run prepublishOnly` (runs build before publishing)

## Code Style Guidelines
- Formatting: Biome (configured in biome.json)
- Indentation: 2 spaces, 80 chars line width
- Classes: PascalCase (AriClient, BaseClient)
- Methods/Variables: camelCase
- Private members: Use TypeScript `private` keyword

## TypeScript Patterns
- Types: Use named exports for types (`export type {...}`)
- Imports: Use `import type {...}` for interfaces
- Organize imports: Node libs → external deps → internal modules
- Error handling: Try/catch with descriptive messages

## Documentation
- JSDoc comments for classes and methods
- Type documentation with descriptive comments
- Include examples in key class documentation