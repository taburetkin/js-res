import { expectType } from 'tsd';
import { RES, OK, Result } from '../../../index.js';

const fromValue = RES('hello');
expectType<Result<string, unknown>>(fromValue);

const existing = OK('keep');
const wrapped = RES(existing);
expectType<Result<string, never>>(wrapped);

const fromNumber = RES(42);
expectType<Result<number, unknown>>(fromNumber);

const fromValueTyped = RES<string, never>('hello');
expectType<Result<string, never>>(fromValueTyped);