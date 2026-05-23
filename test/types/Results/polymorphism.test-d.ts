import { expectType } from 'tsd';
import { Result, Results } from '../../../index.js';

class TimestampResult extends Result {
    timestamp: number = Date.now();

    constructor(value?: unknown, error?: unknown, forcedError?: boolean) {
        super(value, error, forcedError);
    }
}

// Without generic — valid, but returns Result
class MyLibWithoutGeneric extends Results {
    Class = TimestampResult;
}

const libWithoutGeneric = new MyLibWithoutGeneric();
const resWithoutGeneric = libWithoutGeneric.sync(() => 'hello');
expectType<Result>(resWithoutGeneric);

// @ts-expect-error - Property 'timestamp' does not exist on type 'Result'
resWithoutGeneric.timestamp;

// With generic — returns TimestampResult
class MyLibWithGeneric extends Results<TimestampResult> {
    Class = TimestampResult;
}

const libWithGeneric = new MyLibWithGeneric();
const resWithGeneric = libWithGeneric.sync(() => 'hello');
expectType<TimestampResult>(resWithGeneric);
expectType<number>(resWithGeneric.timestamp);
expectType<any>(resWithGeneric.value);  // ← any, потому что sync возвращает any
expectType<boolean>(resWithGeneric.ok);

// ERR with generic
const errWithGeneric = libWithGeneric.ERR<number>(404);
expectType<TimestampResult>(errWithGeneric);
expectType<any>(errWithGeneric.error);  // ← any, потому что ERR возвращает any