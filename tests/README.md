# Testing Setup

This project uses **Vitest** with React Testing Library for component testing.

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
- `tests/components/` - React component tests
- `tests/hooks/` - Hook tests
- `tests/views/` - View component tests (work in progress)

## Testing Environment

- **Framework**: Vitest
- **DOM Environment**: jsdom
- **React Testing**: @testing-library/react
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
