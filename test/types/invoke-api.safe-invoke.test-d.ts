import { expectType } from 'tsd';
import { safeInvoke } from '../../index.js';

// Function call
const [val, err] = safeInvoke(() => 42);
expectType<number | undefined>(val);
expectType<any>(err);

// Non-function value
const [direct, directErr] = safeInvoke(42);
expectType<number | undefined>(direct);
expectType<any>(directErr);

// String as non-function
const [strVal, strErr] = safeInvoke('hello');
expectType<string | undefined>(strVal);
expectType<any>(strErr);

// Function returning string
const [fnStrVal, fnStrErr] = safeInvoke(() => 'hello');
expectType<string | undefined>(fnStrVal);
expectType<any>(fnStrErr);

// Function with arguments
const [sum, sumErr] = safeInvoke((a: number, b: number) => a + b, { invokeArgs: [5, 10] });
expectType<number | undefined>(sum);
expectType<any>(sumErr);