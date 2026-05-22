import { expectType } from 'tsd';
import { OK, ERR, Result } from '../../index.js';

// OK creates Result<T, never>
const ok = OK('hello');
expectType<Result<string, never>>(ok);
expectType<boolean>(ok.ok);
expectType<boolean>(ok.notOk);
expectType<string | undefined>(ok.value);

// ERR creates Result<never, E>
const err = ERR(500);
expectType<Result<never, number>>(err);
expectType<number | undefined>(err.error);

// OK with explicit type
const okNumber = OK<number>(42);
expectType<Result<number, never>>(okNumber);
expectType<number | undefined>(okNumber.value);

// ERR with explicit type
const errObj = ERR<Error>(new Error('fail'));
expectType<Result<never, Error>>(errObj);
expectType<Error | undefined>(errObj.error);