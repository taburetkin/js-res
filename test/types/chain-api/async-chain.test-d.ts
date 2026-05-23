import { expectType } from 'tsd';
import { asyncChain, ChainResult } from '../../../index.js';
import { OK, ERR } from '../../../index.js';

// ========== asyncChain with value ==========

// Number value — never
const chainFromNumber = await asyncChain(42);
expectType<ChainResult<number, never>>(chainFromNumber);

// String value — never
const chainFromString = await asyncChain('hello');
expectType<ChainResult<string, never>>(chainFromString);

// Object value — never
const chainFromObject = await asyncChain({ id: 1 });
expectType<ChainResult<{ id: number }, never>>(chainFromObject);

// Array value — never
const chainFromArray = await asyncChain([1, 2, 3]);
expectType<ChainResult<number[], never>>(chainFromArray);

// null value — never
const chainFromNull = await asyncChain(null);
expectType<ChainResult<null, never>>(chainFromNull);

// undefined value — never
const chainFromUndefined = await asyncChain(undefined);
expectType<ChainResult<undefined, never>>(chainFromUndefined);

// Boolean value — never
const chainFromBoolean = await asyncChain(true);
expectType<ChainResult<boolean, never>>(chainFromBoolean);

// ========== asyncChain with async function ==========

// Async function — Error by default
const chainFromAsyncFn = await asyncChain(async () => 42);
expectType<ChainResult<number, Error>>(chainFromAsyncFn);

// Async function with explicit error type
const chainFromAsyncFnTyped = await asyncChain<number, TypeError>(async () => 42);
expectType<ChainResult<number, TypeError>>(chainFromAsyncFnTyped);

// Async function with arguments
const chainAsyncWithArgs = await asyncChain(async (a: number, b: number) => a + b, { invokeArgs: [5, 10] });
expectType<ChainResult<number, Error>>(chainAsyncWithArgs);

// Async function returning string
const chainAsyncFnString = await asyncChain(async () => 'hello');
expectType<ChainResult<string, Error>>(chainAsyncFnString);

// Async function returning object
const chainAsyncFnObject = await asyncChain(async () => ({ id: 1, name: 'test' }));
expectType<ChainResult<{ id: number; name: string }, Error>>(chainAsyncFnObject);

// ========== asyncChain with sync function ==========

// Sync function — Error by default
const chainFromSyncFn = await asyncChain(() => 42);
expectType<ChainResult<number, Error>>(chainFromSyncFn);

// Sync function with explicit error type
const chainFromSyncFnTyped = await asyncChain<number, TypeError>(() => 42);
expectType<ChainResult<number, TypeError>>(chainFromSyncFnTyped);

// Sync function with arguments
const chainSyncWithArgs = await asyncChain((a: number, b: number) => a + b, { invokeArgs: [5, 10] });
expectType<ChainResult<number, Error>>(chainSyncWithArgs);

// Sync function returning string
const chainSyncFnString = await asyncChain(() => 'hello');
expectType<ChainResult<string, Error>>(chainSyncFnString);

// Sync function returning object
const chainSyncFnObject = await asyncChain(() => ({ id: 1, name: 'test' }));
expectType<ChainResult<{ id: number; name: string }, Error>>(chainSyncFnObject);

// Sync function that throws
const chainThatThrows = await asyncChain(() => { throw new Error('boom'); });
expectType<ChainResult<unknown, Error>>(chainThatThrows);

// ========== asyncChain with Promise ==========

// Promise — Error by default
const chainFromPromise = await asyncChain(Promise.resolve(42));
expectType<ChainResult<number, Error>>(chainFromPromise);

// Promise with explicit error type
const chainFromPromiseTyped = await asyncChain<number, string>(Promise.resolve(42));
expectType<ChainResult<number, string>>(chainFromPromiseTyped);

// Promise with never
const chainFromPromiseNever = await asyncChain<number, never>(Promise.resolve(42));
expectType<ChainResult<number, never>>(chainFromPromiseNever);

// ========== asyncChain.asyncChain method ==========

// Chain with plain values
const chainedPlain = await asyncChain(5)
    .asyncChain(async x => x * 2)
    .asyncChain(async x => x + 1);
expectType<ChainResult<number, Error>>(chainedPlain);

// Chain with OK result
const chainedOk = await asyncChain(5)
    .asyncChain(async x => x * 2)
    .asyncChain(async x => OK(x + 1));
expectType<ChainResult<number, Error>>(chainedOk);

// Chain with ERR result
const chainedErr = await asyncChain(5)
    .asyncChain(async x => x * 2)
    .asyncChain(async x => ERR('error occurred'));
expectType<ChainResult<number, string>>(chainedErr);

// Chain with mixed types
const chainedMixed = await asyncChain('5')
    .asyncChain(async str => parseInt(str))
    .asyncChain(async num => num * 2);
expectType<ChainResult<number, Error>>(chainedMixed);

// Chain with sync function inside asyncChain
const chainedSyncInAsync = await asyncChain(5)
    .asyncChain(async x => x * 2)
    .asyncChain(x => x + 1);
expectType<ChainResult<number, Error>>(chainedSyncInAsync);

// Chain that rejects
const chainedReject = await asyncChain(5)
    .asyncChain(async x => x * 2)
    .asyncChain(async x => { throw new Error('crash'); });
expectType<ChainResult<number, Error>>(chainedReject);

// Multi-step async chain
const step1 = await asyncChain(() => Promise.resolve(10));
const step2 = await step1.asyncChain(async x => Promise.resolve(x * 2));
const step3 = await step2.asyncChain(async x => Promise.resolve(x + 5));
expectType<ChainResult<number, Error>>(step3);