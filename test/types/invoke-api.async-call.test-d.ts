import { expectType } from 'tsd';
import { asyncCall, Result } from '../../index.js';

// Promise
const promiseRes = await asyncCall(Promise.resolve(42));
expectType<Result<number, any>>(promiseRes);

// Function returning Promise
const fnPromiseRes = await asyncCall(async () => 'hello');
expectType<Result<string, any>>(fnPromiseRes);

// Function returning value
const fnValueRes = await asyncCall(() => 42);
expectType<Result<number, any>>(fnValueRes);

// Plain value
const valueRes = await asyncCall(42);
expectType<Result<number, any>>(valueRes);

// Async function returning object
const asyncFnRes = await asyncCall(async () => ({ id: 1 }));
expectType<Result<{ id: number }, any>>(asyncFnRes);

// String as plain value
const stringRes = await asyncCall('hello');
expectType<Result<string, any>>(stringRes);

// Object as plain value
const objRes = await asyncCall({ key: 'value' });
expectType<Result<{ key: string }, any>>(objRes);