import { expectType } from 'tsd';
import { syncCall, Result } from '../../../index.js';

// Function call — Error by default
const res = syncCall(() => 42);
expectType<Result<number, Error>>(res);

// Function with explicit error type
const resExplicit = syncCall<number, TypeError>(() => 42);
expectType<Result<number, TypeError>>(resExplicit);

// Function returning string
const strRes = syncCall(() => 'hello');
expectType<Result<string, Error>>(strRes);

// Function with arguments
const sumWithArgs = syncCall((a: number, b: number) : number => a + b, { invokeArgs: [5, 10] });
expectType<Result<number, Error>>(sumWithArgs);

// Function that throws
const throwRes = syncCall(() => { throw new Error('boom'); });
expectType<Result<unknown, Error>>(throwRes);

// Value — never
const directRes = syncCall(42);
expectType<Result<number, never>>(directRes);

// String as value
const directStrRes = syncCall('hello');
expectType<Result<string, never>>(directStrRes);

// Object as value
const directObjRes = syncCall({ key: 'value' });
expectType<Result<{ key: string }, never>>(directObjRes);

// null as value
const directNullRes = syncCall(null);
expectType<Result<null, never>>(directNullRes);

// undefined as value
const directUndefRes = syncCall(undefined);
expectType<Result<undefined, never>>(directUndefRes);

// Boolean as value
const directBoolRes = syncCall(true);
expectType<Result<boolean, never>>(directBoolRes);

// Array as value
const directArrayRes = syncCall([1, 2, 3]);
expectType<Result<number[], never>>(directArrayRes);