import { expectType } from 'tsd';
import { syncCall, Result } from '../../index.js';

// Function call
const res = syncCall(() => 42);
expectType<Result<number, any>>(res);

// Function returning string
const strRes = syncCall(() => 'hello');
expectType<Result<string, any>>(strRes);

// Function returning object
const objRes = syncCall(() => ({ id: 1 }));
expectType<Result<{ id: number }, any>>(objRes);

// Non-function value (direct value)
const directRes = syncCall(42);
expectType<Result<number, any>>(directRes);

// String as direct value
const directStrRes = syncCall('hello');
expectType<Result<string, any>>(directStrRes);

// Function with arguments
const sumRes = syncCall((a: number, b: number) => a + b, { invokeArgs: [5, 10] });
expectType<Result<number, any>>(sumRes);