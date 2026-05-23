import { expectType } from 'tsd';
import { asyncCall, Result } from '../../../index.js';

// ========== Promise overload ==========

// Promise — Error by default
const promiseRes = await asyncCall(Promise.resolve(42));
expectType<Result<number, Error>>(promiseRes);

// Promise with explicit error type
const promiseResTyped = await asyncCall<number, string>(Promise.resolve(42));
expectType<Result<number, string>>(promiseResTyped);

// Promise with never
const promiseResNever = await asyncCall<number, never>(Promise.resolve(42));
expectType<Result<number, never>>(promiseResNever);

// ========== Function overload (async function) ==========

// Async function returning Promise — Error by default
const asyncFnRes = await asyncCall(async () => 'hello');
expectType<Result<string, Error>>(asyncFnRes);

// Async function with explicit error type
const asyncFnResTyped = await asyncCall<string, RangeError>(async () => 'hello');
expectType<Result<string, RangeError>>(asyncFnResTyped);

// Async function with arguments
const asyncFnWithArgs = await asyncCall(async (a: number, b: number) => a + b, { invokeArgs: [5, 10] });
expectType<Result<number, Error>>(asyncFnWithArgs);

// Async function returning object
const asyncFnObjRes = await asyncCall(async () => ({ id: 1, name: 'test' }));
expectType<Result<{ id: number; name: string }, Error>>(asyncFnObjRes);

// ========== Function overload (sync function) ==========

// Sync function returning value — Error by default
const syncFnRes = await asyncCall(() => 42);
expectType<Result<number, Error>>(syncFnRes);

// Sync function with explicit error type
const syncFnResTyped = await asyncCall<number, TypeError>(() => 42);
expectType<Result<number, TypeError>>(syncFnResTyped);

// Sync function with arguments
const syncFnWithArgs = await asyncCall((a: number, b: number) => a + b, { invokeArgs: [5, 10] });
expectType<Result<number, Error>>(syncFnWithArgs);

// Sync function returning string
const syncFnStrRes = await asyncCall(() => 'hello');
expectType<Result<string, Error>>(syncFnStrRes);

// Sync function returning object
const syncFnObjRes = await asyncCall(() => ({ id: 1, name: 'test' }));
expectType<Result<{ id: number; name: string }, Error>>(syncFnObjRes);

// Sync function that throws
const syncFnThrowRes = await asyncCall(() => { throw new Error('boom'); });
expectType<Result<unknown, Error>>(syncFnThrowRes);

// ========== Value overload (non-function) ==========

// Number value — never
const valueRes = await asyncCall(42);
expectType<Result<number, never>>(valueRes);

// String value — never
const stringRes = await asyncCall('hello');
expectType<Result<string, never>>(stringRes);

// Object value — never
const objRes = await asyncCall({ key: 'value' });
expectType<Result<{ key: string }, never>>(objRes);

// Array value — never
const arrayRes = await asyncCall([1, 2, 3]);
expectType<Result<number[], never>>(arrayRes);

// null value — never
const nullRes = await asyncCall(null);
expectType<Result<null, never>>(nullRes);

// undefined value — never
const undefRes = await asyncCall(undefined);
expectType<Result<undefined, never>>(undefRes);

// Boolean value — never
const boolRes = await asyncCall(true);
expectType<Result<boolean, never>>(boolRes);