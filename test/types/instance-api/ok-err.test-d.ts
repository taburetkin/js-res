import { expectType } from 'tsd';
import { OK, ERR, Result } from '../../../index.js';

const ok = OK('hello');
expectType<Result<string, never>>(ok);
expectType<string | undefined>(ok.value);
expectType<boolean>(ok.ok);

const err = ERR(500);
expectType<Result<never, number>>(err);
expectType<number | undefined>(err.error);

const okNumber = OK(42);
expectType<Result<number, never>>(okNumber);
expectType<number | undefined>(okNumber.value);

const okObject = OK({ id: 1 });
expectType<Result<{ id: number }, never>>(okObject);