import { expectType } from 'tsd';
import { syncChain, ChainResult } from '../../../index.js';
import { OK, ERR } from '../../../index.js';

// ========== syncChain with value ==========

// Number value — never
const chainFromNumber = syncChain(42);
expectType<ChainResult<number, never>>(chainFromNumber);

// String value — never
const chainFromString = syncChain('hello');
expectType<ChainResult<string, never>>(chainFromString);

// Object value — never
const chainFromObject = syncChain({ id: 1, name: 'test' });
expectType<ChainResult<{ id: number; name: string }, never>>(chainFromObject);

// Array value — never
const chainFromArray = syncChain([1, 2, 3]);
expectType<ChainResult<number[], never>>(chainFromArray);

// null value — never
const chainFromNull = syncChain(null);
expectType<ChainResult<null, never>>(chainFromNull);

// undefined value — never
const chainFromUndefined = syncChain(undefined);
expectType<ChainResult<undefined, never>>(chainFromUndefined);

// Boolean value — never
const chainFromBoolean = syncChain(true);
expectType<ChainResult<boolean, never>>(chainFromBoolean);

// ========== syncChain with function ==========

// Function returning number — Error by default
const chainFromFn = syncChain(() => 42);
expectType<ChainResult<number, Error>>(chainFromFn);

// Function with explicit error type
const chainFromFnTyped = syncChain<number, TypeError>(() => 42);
expectType<ChainResult<number, TypeError>>(chainFromFnTyped);

// Function returning string
const chainFromFnString = syncChain(() => 'hello');
expectType<ChainResult<string, Error>>(chainFromFnString);

// Function returning object
const chainFromFnObject = syncChain(() => ({ id: 1, name: 'test' }));
expectType<ChainResult<{ id: number; name: string }, Error>>(chainFromFnObject);

// Function with arguments
const chainWithArgs = syncChain((a: number, b: number) => a + b, { invokeArgs: [5, 10] });
expectType<ChainResult<number, Error>>(chainWithArgs);

// Function with multiple arguments
const chainWithMultipleArgs = syncChain((a: number, b: number, c: number) => a + b + c, { invokeArgs: [1, 2, 3] });
expectType<ChainResult<number, Error>>(chainWithMultipleArgs);

// Function that throws
const chainThatThrows = syncChain(() => { throw new Error('boom'); });
expectType<ChainResult<unknown, Error>>(chainThatThrows);

// ========== syncChain.chain method ==========

// Chain with plain values
const chainedPlain = syncChain(5)
    .syncChain(x => x * 2)
    .syncChain(x => x + 1);
expectType<ChainResult<number, Error>>(chainedPlain);

// Chain with OK result
const chainedOk = syncChain(5)
    .syncChain(x => x * 2)
    .syncChain(x => OK(x + 1));
expectType<ChainResult<number, Error>>(chainedOk);

// Chain with ERR result
const chainedErr = syncChain(5)
    .syncChain(x => x * 2)
    .syncChain(x => ERR('error occurred'));
expectType<ChainResult<number, string>>(chainedErr);

// Chain with mixed types
const chainedMixed = syncChain('5')
    .syncChain(str => parseInt(str))
    .syncChain(num => num * 2);
expectType<ChainResult<number, Error>>(chainedMixed);

// Chain that throws in the middle
const chainedThrow = syncChain(5)
    .syncChain(x => x * 2)
    .syncChain(x => { throw new Error('crash'); });
expectType<ChainResult<number, Error>>(chainedThrow);