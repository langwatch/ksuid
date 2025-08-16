# KSUID

A modern, zero-dependency library for generating prefixed, k-sorted globally unique identifiers (KSUIDs) across multiple programming languages.

[![NPM Version](https://img.shields.io/npm/v/@langwatch/ksuid.svg?style=flat)](https://www.npmjs.org/package/@langwatch/ksuid)
[![Build Status](https://img.shields.io/github/actions/workflow/status/langwatch/ksuid/ci.yml?branch=main)](https://github.com/langwatch/ksuid/actions)
[![Coverage Status](https://img.shields.io/codecov/c/github/langwatch/ksuid/main)](https://codecov.io/gh/langwatch/ksuid)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://www.npmjs.org/package/@langwatch/ksuid)

## Features

- ✅ **Zero Dependencies** - No external dependencies
- ✅ **TypeScript First** - Full TypeScript support with strict typing
- ✅ **Cross-Platform** - Works in Node.js, Browser, Bun, and Deno
- ✅ **K-Sortable** - IDs are naturally sortable by creation time
- ✅ **Environment Aware** - Support for different environments (prod, dev, staging, etc.)
- ✅ **Instance Detection** - Automatic detection of Docker containers, MAC addresses, and PIDs
- ✅ **Developer Friendly** - A KSUID is selectable by double-clicking, bad day to be a hyphenated id.

## Available Implementations

### JavaScript/TypeScript ✅

The JavaScript implementation is production-ready and available on npm:

```bash
npm install @langwatch/ksuid
```

**Features:**
- Zero dependencies
- Full TypeScript support
- Cross-platform compatibility (Node.js, Browser, Bun, Deno)
- Automatic instance detection
- Environment-aware ID generation

**Quick Start:**
```typescript
import { generate, parse } from '@langwatch/ksuid';

// Generate a KSUID
const ksuid = generate('user');
console.log(ksuid.toString());
// Output: user_00028U9MDT583X9eXPG1IU0ptdl1m

// Parse a KSUID
const parsed = parse('user_00028U9MDT583X9eXPG1IU0ptdl1m');
console.log(parsed.resource); // 'user'
console.log(parsed.environment); // 'prod'
console.log(parsed.date); // Date object
```

📖 **[Full JavaScript Documentation](js/README.md)**

### Other Languages 🚧

We'll be adding support for other languages as we need them, Python will likely be the first one.

## What is KSUID?

KSUID (K-Sortable Unique IDentifier) is a globally unique identifier that is:

1. **K-Sortable** - IDs are naturally sortable by creation time
2. **Globally Unique** - No coordination required between systems
3. **URL Safe** - Uses base62 encoding (no special characters)
4. **Time-Based** - Contains a timestamp for easy debugging and analytics
5. **Instance Aware** - Includes machine/container identification

### KSUID Format

```
[environment_][resource_][timestamp][instance][sequence]
```

**Example:**
```
prod_user_00028U9MDT583X9eXPG1IU0ptdl1m
```

- `prod_` - Environment prefix (optional)
- `user_` - Resource type prefix
- `00028U9MDT583X9eXPG1IU0ptdl1m` - Base62 encoded payload containing:
  - 32-bit timestamp (seconds since epoch)
  - 64-bit instance identifier
  - 32-bit sequence number

## Use Cases

- **Database Primary Keys** - Natural sorting by creation time
- **Distributed Systems** - No coordination required
- **Event IDs** - Time-based ordering for event streams
- **File Names** - URL-safe identifiers
- **API Request IDs** - Unique request tracking
- **User Sessions** - Environment-aware session management

## Comparison with Other ID Types

| Feature                   | UUID     | ULID     | KSUID     | Snowflake |
| ------------------------- | -------- | -------- | --------- | --------- |
| Size                      | 36 chars | 26 chars | ~27 chars | 19 chars  |
| Sortable                  | ❌        | ✅        | ✅         | ✅         |
| URL Safe                  | ❌        | ✅        | ✅         | ✅         |
| Zero Dependencies         | ✅        | ✅        | ✅         | ❌         |
| Instance Aware            | ❌        | ❌        | ✅         | ✅         |
| Environment Aware         | ❌        | ❌        | ✅         | ❌         |
| Double-click to highlight | ❌        | ❌        | ✅         | ✅         |

## Development

### Setup

```bash
git clone https://github.com/langwatch/ksuid.git
cd ksuid
```

### JavaScript Development

```bash
cd js
npm install
npm run build      # Build the library
npm run dev        # Watch mode for development
npm run test       # Run tests
npm run test:coverage # Run tests with coverage
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
```

### Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests for new functionality**
5. **Ensure all tests pass**
6. **Submit a pull request**

### Adding New Language Implementations

To add support for a new programming language:

1. Create a new directory for the language (e.g., `python/`, `go/`, `rust/`)
2. Implement the core KSUID functionality following the specification
3. Add comprehensive tests
4. Update this README with the new implementation
5. Submit a pull request

## Specification

The KSUID specification ensures compatibility across all language implementations:

- **Timestamp**: 32-bit Unix timestamp (seconds since epoch)
- **Instance**: 64-bit instance identifier (MAC address, container ID, or random)
- **Sequence**: 32-bit sequence number (increments for same timestamp)
- **Encoding**: Base62 (URL-safe alphanumeric characters)
- **Format**: `[environment_][resource_][payload]`

## License

MIT License - please see the LICENSE file in the respective language directory.

## Acknowledgments

This library is inspired by the original [KSUID specification](https://github.com/segmentio/ksuid) and the [@cuvva/ksuid](https://github.com/cuvva/ksuid-node) implementation.

## Support

- 📖 **Documentation**: [JavaScript Implementation](js/README.md)
- 🐛 **Issues**: [GitHub Issues](https://github.com/langwatch/ksuid/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/langwatch/discussions)
- 📧 **Email**: [support@langwatch.com](mailto:support@langwatch.com)
