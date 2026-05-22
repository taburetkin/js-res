import { expectType } from 'tsd';
import { OK, ERR, syncCall, Result } from '../../index.js';

// init hook
const withInit = OK(10, {
    init: (r) => {
        expectType<Result<number, never>>(r);
    }
});

// invokeContext
const ctx = { multiplier: 2 };
function fn(this: { multiplier: number }, val: number) {
    return val * this.multiplier;
}
const withContext = syncCall(fn, { invokeContext: ctx, invokeArgs: [10] });
expectType<Result<number, any>>(withContext);

// invokeArgs
const withArgs = syncCall((a: number, b: number) => a + b, { invokeArgs: [5, 10] });
expectType<Result<number, any>>(withArgs);

// ERR with init
const errWithInit = ERR('error', {
    init: (r) => {
        expectType<Result<never, string>>(r);
    }
});