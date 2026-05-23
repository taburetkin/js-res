import { expectType } from 'tsd';
import { safeInvoke } from '../../../index.js';

// Function call — Error by default
const [val, err] = safeInvoke(() => 42);
expectType<number | undefined>(val);
expectType<Error | undefined>(err);

// Function with explicit error type
const [valExplicit, errExplicit] = safeInvoke<number, TypeError>(() => 42);
expectType<number | undefined>(valExplicit);
expectType<TypeError | undefined>(errExplicit);

// Function returning string
const [strVal, strErr] = safeInvoke(() => 'hello');
expectType<string | undefined>(strVal);
expectType<Error | undefined>(strErr);

// Function with arguments — нужно обернуть в функцию
const [sum, sumErr] = safeInvoke(() => (a: number, b: number) => a + b, { invokeArgs: [5, 10] });
expectType<((a: number, b: number) => number) | undefined>(sum);
expectType<Error | undefined>(sumErr);

// Function that throws
const [throwVal, throwErr] = safeInvoke(() => { throw new Error('boom'); });
expectType<unknown | undefined>(throwVal);
expectType<Error | undefined>(throwErr);

// Value — never (значение не может бросить ошибку)
const [direct, directErr] = safeInvoke(42);
expectType<number | undefined>(direct);
expectType<never | undefined>(directErr);

// String as value
const [strDirect, strDirectErr] = safeInvoke('hello');
expectType<string | undefined>(strDirect);
expectType<never | undefined>(strDirectErr);

// Object as value
const [objDirect, objDirectErr] = safeInvoke({ key: 'value' });
expectType<{ key: string } | undefined>(objDirect);
expectType<never | undefined>(objDirectErr);

// null as value
const [nullDirect, nullDirectErr] = safeInvoke(null);
expectType<null | undefined>(nullDirect);
expectType<never | undefined>(nullDirectErr);

// undefined as value
const [undefDirect, undefDirectErr] = safeInvoke(undefined);
expectType<undefined | undefined>(undefDirect);
expectType<never | undefined>(undefDirectErr);