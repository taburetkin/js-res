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

## How does `js-res` compare to other libraries?

| Feature / Library | `js-res` | `neverthrow` | `fp-ts` / `effect-ts` |
| :--- | :--- | :--- | :--- |
| **Sync/Async Chaining** | ✅ **Explicit**. `syncChain` for sync, `asyncChain` for async. No hidden switches | 🟡 Implicit. `Result` vs `ResultAsync` are separate types | 🟡 Implicit. Uses `TaskEither` / `Effect` |
| **Async Visibility** | ✅ **Clear**. User always knows where async happens | ❌ Can be invisible. `asyncMap` hides the switch | ❌ Can be invisible. Effect system abstracts it |
| **Type Safety on Mixing** | ✅ **Strict**. TypeScript errors when mixing sync/async incorrectly | 🟡 Soft. Requires manual type conversion | 🟡 Soft. Requires lifting into Effect |
| **Learning Curve** | 🟢 **Low**. Explicit methods, no magic | 🟡 Medium | 🔴 High |
| **Bundle Size & Tree-shaking** | ✅ **Zero deps, fully tree-shakeable** | ❌ Contains more overhead | ❌ Very large |
| **Customization / Polymorphism** | ✅ **First-class support**. Extend `Results` class | ❌ Not a core feature | ❌ Extending classes is anti-pattern |

**Summary on chaining:** Functional libraries often pretend you can mix sync and async seamlessly, but under the hood they use separate types or monads. `js-res` is **honest** — you choose `syncChain` or `asyncChain` upfront, and TypeScript helps you stay on track.

## What's in the box?

| Export | Description |
|--------|-------------|
| `Result` | Base container class with `value`, `error`, `ok`, `notOk`, `forcedError`, `match`, `fold` |
| `OK(value, options?)` | Create a success Result |
| `ERR(error, options?)` | Create an error Result (forces `ok = false`) |
| `RES(arg, options?)` | Convert any value to Result (auto-detects success/error) |
| `syncCall(fn, options?)` | Execute sync function, catch throws → returns Result |
| `asyncCall(fnOrPromise, options?)` | Execute async function, catch rejections/thrown → returns Promise<Result> |
| `safeInvoke(fn, options?)` | Go‑style: returns `[value, error]` tuple |
| `Results` | Base class for polymorphism — extend to create your own Result factory |
| `syncChain(arg, options?)` | Start a synchronous chain |
| `asyncChain(arg, options?)` | Start an asynchronous chain |

**Tree‑shakeable:** Import only what you need. *No separate modules — all exports from the main package.*

## Why UPPERCASE?

You might wonder why the core factories — `OK`, `ERR`, `RES` — are in uppercase.

**Short answer:** Clarity without conflict.

**Longer explanation:**

In real‑world JavaScript codebases, `ok`, `err`, and `res` are extremely common variable names:
- `ok` – boolean flag (`let ok = await validate()`)
- `err` – error object (`if (err) ...`)
- `res` – response object (`const res = await fetch(...)`)

Using lowercase names for the factories would cause constant name collisions and confusion, forcing developers to rename imports every single time:

```typescript
// Not ideal
import { ok as isOk, err as asError, res as toResult } from 'js-res';
```

Uppercase makes the factories stand out clearly:

```typescript
import { OK, ERR, RES } from 'js-res';

const result = OK('data');        // clearly a factory
const err = ERR('fail');          // no conflict with 'err' variable
const data = RES(something);      // no confusion with 'res' response
```

**If you prefer camelCase**, you can easily re‑export with your own names:

```javascript
// my-js-res.js
import { OK as ok, ERR as err, RES as res } from 'js-res';
export { ok, err, res };
export * from 'js-res';
```

Uppercase is a deliberate design choice — not to be different, but to be **practical**.

## Installation

```bash
npm install js-res
```

## Quick Start

```typescript
import { OK, ERR, RES, syncCall, asyncCall } from 'js-res';

// Create success
const success = OK('data');
console.log(success.ok);     // true
console.log(success.value);  // 'data'
// TypeScript knows: success.error is never (cannot exist)

// Create error
const failure = ERR('something went wrong');
console.log(failure.notOk);  // true
console.log(failure.error);  // 'something went wrong'
// TypeScript knows: failure.value is never (cannot exist)

// Convert any value to Result (auto-detects success/error)
const autoOk = RES(42);        // Result<number, never>
const asValue = RES('hello');  // Result<string, unknown>

// Replace try/catch
const result = syncCall(() => {
    return JSON.parse('{"valid": "json"}');
});
if (result.ok) {
    console.log(result.value);
} else {
    console.error(result.error);
}

// Using match
const message = result.match({
    ok: (value) => `Success: \${value}`,
    err: (error) => `Error: \${error}`
});

// Using fold
const output = result.fold(
    (value) => value.toUpperCase(),
    (error) => error.message
);

// Binding context and arguments
const parsed = syncCall(JSON.parse, {
    invokeContext: JSON,
    invokeArgs: ['{"key": "value"}']
});
console.log(parsed.value); // { key: 'value' }
```

## Functional Chains (Explicit Sync/Async)

Unlike functional libraries that hide async switches, `js-res` keeps it **explicit**:

```typescript
import { syncChain, asyncChain, OK } from 'js-res';

// ✅ Synchronous chain — all steps must be sync
const syncResult = syncChain(5)
    .syncChain(x => x * 2)           // sync
    .syncChain(x => OK(x + 1))       // sync, returns Result
    .match({
        ok: (v) => `Success: \${v}`,
        err: (e) => `Error: \${e}`
    });

// ✅ Asynchronous chain — explicit from start
const asyncResult = await asyncChain(() => fetch('/api/user'))
    .asyncChain(res => res.json())    // async
    .asyncChain(user => user.id)      // can be sync, still works
    .fold(
        err => console.error(err),
        id => console.log(`User ID: \${id}`)
    );

// ❌ This will NOT work — TypeScript prevents mixing
const wrong = syncChain(5)
    .syncChain(x => Promise.resolve(x * 2));  // Type error!
```

**Why explicit is better:**

- You always know if your chain is sync or async
- No hidden performance surprises
- TypeScript catches mistakes before runtime
- Code is self-documenting

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

### What happens with `new Result(undefined, undefined)`?

`Result` constructor accepts three parameters: `value`, `error`, and `forcedError` (internal).

Here's how `ok` is determined:

| `forcedError` | `error == null` | `ok` | Use case |
|---------------|-----------------|-------|-----------|
| `false` | `true` | `true` | Normal success |
| `false` | `false` | `false` | Normal error |
| `true` | any | `false` | Explicit error (from `ERR` or catch block) |

**Examples:**

```typescript
// Normal success
const res1 = new Result('data', null);
console.log(res1.ok);      // true

// Normal error
const res2 = new Result(undefined, 'fail');
console.log(res2.ok);      // false

// ERR always creates error, even with null
const res3 = ERR(null);
console.log(res3.ok);      // false (thanks to forcedError)
console.log(res3.error);   // null

// OK always creates success
const res4 = OK(null);
console.log(res4.ok);      // true
console.log(res4.value);   // null
```

**Why this matters:**

When catching errors from `try/catch` or rejected promises, the error value might be `null` or `undefined`. Using `ERR` ensures these are treated as errors, not successes. `RES` automatically detects based on the value.

### TypeScript Benefits

With `js-res`, TypeScript knows exactly what state your Result is in:

```typescript
const success = OK('hello');
// Type: Result<string, never>
// success.error is never — cannot exist!

const failure = ERR(404);
// Type: Result<never, number>
// failure.value is never — cannot exist!

// When you check .ok, TypeScript narrows the type
if (success.ok) {
    console.log(success.value); // string
    // success.error is never here
} else {
    console.log(success.error); // never — actually impossible
}
```

## TypeScript Error Type Defaults

`js-res` makes sensible assumptions about error types:

| Function | Default Error Type | Why |
|----------|-------------------|-----|
| `syncCall(value)` | `never` | Values never throw |
| `syncCall(fn)` | `Error` | Functions throw `Error` by default |
| `asyncCall(value)` | `never` | Values never throw |
| `asyncCall(fn)` | `Error` | Async functions reject with `Error` by default |
| `asyncCall(Promise)` | `unknown` | Promise rejection reason can be anything |
| `RES(arg)` | `unknown` | Conversion result type depends on input |

**Examples:**

```typescript
import { syncCall, asyncCall, Result } from 'js-res';

// Value — never throws
const fromValue: Result<number, never> = syncCall(42);

// Sync function — Error by default
const fromSync: Result<string, Error> = syncCall(() => JSON.parse(str));

// Explicit error type
const withExplicit: Result<Data, SyntaxError> = syncCall<Data, SyntaxError>(() => JSON.parse(str));

// Async function — Error by default
const fromAsync: Promise<Result<Response, Error>> = asyncCall(() => fetch('/api'));

// Promise — unknown (rejection reason can be anything)
const fromPromise: Promise<Result<string, unknown>> = asyncCall(Promise.resolve('data'));
```

**Why `Error` by default?**

In 99% of JavaScript/TypeScript code, thrown errors are `Error` or its subclasses. Using `Error` as default gives you type safety without boilerplate. If you throw something else, specify the type explicitly.

## Advanced: Polymorphism

When you need custom behavior, extend `Results`:

```typescript
import { Results, Result } from 'js-res';

class MyResult extends Result {
    timestamp: number;

    constructor(value?: any, error?: any, forcedError?: boolean) {
        super(value, error, forcedError);
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
| `OK<T>(value, options?)` | Create success Result with type T |
| `ERR<E>(error, options?)` | Create error Result with type E |
| `RES<T, E = unknown>(arg, options?)` | Convert any value to Result (auto-detects success/error) |
| `syncCall<T>(value, options?)` | Return Result<T, never> from value |
| `syncCall<T, E = Error>(fn, options?)` | Execute sync function, return Result<T, E> |
| `asyncCall<T>(value, options?)` | Return Promise<Result<T, never>> from value |
| `asyncCall<T, E = Error>(fn, options?)` | Execute async function, return Promise<Result<T, E>> |
| `asyncCall<T>(promise, options?)` | Wrap Promise, return Promise<Result<T, unknown>> |
| `safeInvoke<T>(fn, options?)` | Go-style: returns `[value, error]` tuple |

### Result instance properties and methods

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `value` | `T \| undefined` | Success value (undefined if error) |
| `error` | `E \| undefined` | Error value (undefined if success) |
| `ok` | `boolean` | True if success |
| `notOk` | `boolean` | True if error (alternative to `!ok`) |
| `forcedError` | `boolean` | True if explicitly created as error |
| `match(handlers)` | `U` | Object-style pattern matching |
| `fold(onOk, onErr)` | `U` | Function-style pattern matching |

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
| `RES(arg, options?)` | Convert to instance of R |
| `safeInvoke(fn, options?)` | Go-style with custom class |
| `syncCall(fn, options?)` | Sync call with custom class |
| `asyncCall(fnOrPromise, options?)` | Async call with custom class |
| `sync(fn, options?)` | Short alias for `syncCall` |
| `async(fnOrPromise, options?)` | Short alias for `asyncCall` |
| `Class` | Constructor to use (default: `Result`) |

## Chain API

Use `syncChain` and `asyncChain` for functional chains — they are exported from the main module.

| Function | Description |
|----------|-------------|
| `syncChain(value, options?)` | Start a synchronous chain from value (error = never) |
| `syncChain<E = Error>(fn, options?)` | Start a synchronous chain from function |
| `asyncChain(value, options?)` | Start an asynchronous chain from value |
| `asyncChain<E = Error>(fn, options?)` | Start an asynchronous chain from function |
| `asyncChain(promise, options?)` | Start an asynchronous chain from Promise |

## TypeScript

```typescript
import { Result, OK, ERR, RES, syncCall, asyncCall } from 'js-res';

// TypeScript knows exact state
const success: Result<string, never> = OK('hello');
const failure: Result<never, Error> = ERR(new Error('fail'));

// RES converts values
const fromValue: Result<number, never> = RES(42);
const fromString: Result<string, unknown> = RES('hello');

// match with type narrowing
const message = success.match({
    ok: (value) => value.toUpperCase(),
    err: (error) => 'never happens'
});

// fold with type narrowing
const length = success.fold(
    (value) => value.length,
    (error) => 0
);

if (success.ok) {
    console.log(success.value.toUpperCase()); // safe
    // success.error is never — TypeScript knows it can't exist
}

if (failure.notOk) {
    console.error(failure.error.message); // safe
    // failure.value is never — TypeScript knows it can't exist
}

// For those who prefer positive checks
if (failure.forcedError) {
    console.log('This was explicitly created as an error');
}
```

## Tree Shaking

`js-res` is fully tree-shakeable. If you only use `OK` and `ERR`:

```javascript
import { OK, ERR } from 'js-res';
```

Bundlers (Webpack, Vite, Rollup, esbuild) will exclude `syncCall`, `asyncCall`, `Results`, `syncChain`, and `asyncChain`.

## License

ISC © dimtabu