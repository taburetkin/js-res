# js-res

[![npm version](https://img.shields.io/npm/v/js-res.svg)](https://www.npmjs.com/package/js-res)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)](https://www.npmjs.com/package/js-res)

> Minimal, tree-shakeable Result pattern for JavaScript and TypeScript.
> **Zero dependencies.** Works everywhere: Node.js, Deno, Bun, browsers.

## Why another Result library?

Most Result libraries force you into a functional programming style:
- Using `map`, `chain`, `fold` for everything
- Treating Result as a monad first, container second

This is great for complex transformations, but overkill for simple checks.

**`js-res` gives you choice:**
1. **Simple imperative style** — `if (result.ok)` and `safeInvoke`
2. **Go-style tuples** — `const [val, err] = safeInvoke(...)`
3. **Functional style when you need it** — extend via `Results` and add your own `map`/`chain`
4. **No forced patterns** — use what makes sense for your code

## Features

- 🪶 **Tiny** — core is ~14 lines, **zero dependencies**
- 📦 **Tree-shakeable** — use only what you need
- 🎯 **Simple 80% API** — `OK`, `ERR`, `syncCall`, `asyncCall`
- 🧙 **Polymorphic 20% API** — extend with `class MyLib extends Results`
- 🔧 **Hackable** — `init` hook for quick customizations
- 📝 **TypeScript** — full type definitions

## Installation

```bash
npm install js-res
```

## Quick Start

```typescript
import { OK, ERR, syncCall, asyncCall } from 'js-res';

// Create success
const success = OK('data');
console.log(success.ok);     // true
console.log(success.value);  // 'data'

// Create error
const failure = ERR('something went wrong');
console.log(failure.notOk);  // true (for those who don't like !res.ok)
console.log(failure.error);  // 'something went wrong'

// Replace try/catch
const result = syncCall(() => {
    return JSON.parse('{"valid": "json"}');
});
if (result.ok) {
    console.log(result.value);
} else {
    console.error(result.error);
}

// Binding context and arguments
const parsed = syncCall(JSON.parse, {
    invokeContext: JSON,
    invokeArgs: ['{"key": "value"}']
});
console.log(parsed.value); // { key: 'value' }
```

### Async calls — correct usage

**❌ Wrong — will NOT catch sync throws:**
```typescript
// If fetch throws before returning Promise (e.g., wrong URL format),
// the error won't be caught by asyncCall
const result = await asyncCall(fetch('/api'));
```

**✅ Correct — wrap in function:**
```typescript
// Function is called inside safeInvoke, both sync throws and async rejections are caught
const result = await asyncCall(() => fetch('/api'));
if (result.ok) {
    console.log(await result.value.json());
} else {
    console.error('Failed:', result.error);
}
```

**✅ Alternative — with invokeArgs:**
```typescript
const result = await asyncCall(fetch, {
    invokeArgs: ['/api']
});
if (result.ok) {
    console.log(await result.value.json());
} else {
    console.error('Failed:', result.error);
}
```

### Go-style safeInvoke

```typescript
import { safeInvoke } from 'js-res';

const [value, error] = safeInvoke(() => riskyOperation());
if (error) {
    console.error('Caught:', error);
} else {
    console.log('Value:', value);
}
```

## Advanced: Polymorphism

When you need custom behavior, extend `Results`:

```typescript
import { Results, Result } from 'js-res';

class MyResult extends Result {
    timestamp: number;

    constructor(value?: any, error?: any) {
        super(value, error);
        this.timestamp = Date.now();
    }
}

class MyLib extends Results<MyResult> {
    Class = MyResult;
}

const jsres = new MyLib();
const result = jsres.sync(() => 'hello');
console.log(result.timestamp); // ✅ TypeScript knows about timestamp
console.log(result.value);     // 'hello'
```

### Quick customization with `init`

```typescript
import { ERR } from 'js-res';

const result = ERR('error', {
    init: (r) => Object.assign(r, { customField: 123 })
});

console.log(result.customField); // 123
```

## API Reference

### Simple API

| Function | Description |
|----------|-------------|
| `OK(value, options?)` | Create success Result |
| `ERR(error, options?)` | Create error Result |
| `syncCall(fn, options?)` | Execute sync function, return Result |
| `asyncCall(fnOrPromise, options?)` | Execute async function, return Promise<Result> |
| `safeInvoke(fn, options?)` | Go-style: returns `[value, error]` tuple |

### Result instance properties

| Property | Type | Description |
|----------|------|-------------|
| `value` | `T \| undefined` | Success value (undefined if error) |
| `error` | `E \| undefined` | Error value (undefined if success) |
| `ok` | `boolean` | True if success |
| `notOk` | `boolean` | True if error (alternative to `!ok`) |

### Options

| Option | Type | Description |
|--------|------|-------------|
| `init` | `(result) => void` | Hook to modify result after creation |
| `invokeContext` | `any` | `this` context for function call |
| `invokeArgs` | `any[]` | Arguments for function call |

### Polymorphic API (class Results)

| Method | Description |
|--------|-------------|
| `OK(value, options?)` | Create success (bound to instance) |
| `ERR(error, options?)` | Create error (bound to instance) |
| `sync(fn, options?)` | Sync call with custom class |
| `async(fnOrPromise, options?)` | Async call with custom class |
| `safeInvoke(fn, options?)` | Go-style with custom class |
| `Class` | Constructor to use (default: `Result`) |

## TypeScript

```typescript
import { Result, OK } from 'js-res';

const result: Result<string, Error> = OK('hello');

if (result.ok) {
    console.log(result.value.toUpperCase());
} else {
    console.error(result.error.message);
}

// For those who prefer positive checks
if (result.notOk) {
    console.error('Something went wrong');
}
```

## Tree Shaking

`js-res` is fully tree-shakeable. If you only use `OK` and `ERR`:

```javascript
import { OK, ERR } from 'js-res';
```

Bundlers (Webpack, Vite, Rollup, esbuild) will exclude `syncCall`, `asyncCall`, and `Results`.

## License

ISC © dimtabu
