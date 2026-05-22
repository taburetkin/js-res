import { expectType } from 'tsd';
import { RES, OK, Result } from '../../index.js';

// Convert plain value to Result
const fromValue = RES('hello');
expectType<Result<string, unknown>>(fromValue);

// Convert existing Result (OK returns Result<string, never>)
const existing = OK('keep');
const wrapped = RES(existing);
expectType<Result<string, never>>(wrapped);

// From catch block — becomes error Result
const fromError = RES('error message', {}, true);
expectType<Result<string, unknown>>(fromError);

// Convert number
const fromNumber = RES(42);
expectType<Result<number, unknown>>(fromNumber);

// Convert with explicit types
const fromValueTyped = RES<string, never>('hello');
expectType<Result<string, never>>(fromValueTyped);