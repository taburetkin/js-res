import { expectType } from 'tsd';
import { OK, ERR, Result } from '../../index.js';

// OK with auto type inference
const ok = OK('hello');
expectType<Result<string, never>>(ok);
expectType<string | undefined>(ok.value);
expectType<boolean>(ok.ok);
expectType<boolean>(ok.notOk);
expectType<boolean>(ok.forcedError);

// ERR with auto type inference
const err = ERR(500);
expectType<Result<never, number>>(err);
expectType<number | undefined>(err.error);
expectType<boolean>(err.ok);
expectType<boolean>(err.notOk);
expectType<boolean>(err.forcedError);

// Different types
const okNumber = OK(42);
expectType<Result<number, never>>(okNumber);
expectType<number | undefined>(okNumber.value);

const okObject = OK({ id: 1 });
expectType<Result<{ id: number }, never>>(okObject);