# Testing Setup

This project uses **Vitest** for unit testing with Vue Test Utils for component testing.

## Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test tests/basic.test.js
```

## Test Structure

- `tests/basic.test.js` - Basic functionality tests
- `tests/utils.test.js` - Utility function tests
- `tests/components/` - Vue component tests (work in progress)
- `tests/composables/` - Composable function tests (work in progress)
- `tests/views/` - View component tests (work in progress)

## Testing Environment

- **Framework**: Vitest
- **DOM Environment**: jsdom
- **Vue Testing**: @vue/test-utils
- **Mocking**: Built-in Vitest mocking

## Configuration

- `vitest.config.js` - Vitest configuration
- `tests/setup.js` - Test setup and global mocks

## Writing Tests

Basic test structure:
```javascript
import { describe, it, expect } from 'vitest'

describe('Component Name', () => {
  it('should do something', () => {
    expect(true).toBe(true)
  })
})
```