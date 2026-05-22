import { expectType } from 'tsd';
import { ChainResult, syncChain, asyncChain } from '../../index.js';
import { OK, ERR } from '../../index.js';

// syncChain with value
const chainFromValue = syncChain(42);
expectType<ChainResult<number, any>>(chainFromValue);

// syncChain with function
const chainFromFn = syncChain(() => 42);
expectType<ChainResult<number, any>>(chainFromFn);

// syncChain.chain with value
const chained = syncChain(5)
    .syncChain(x => x * 2)
    .syncChain(x => OK(x + 1));
expectType<ChainResult<number, any>>(chained);

// syncChain.chain with error — не проверяем тип, просто убеждаемся что работает
syncChain(5).syncChain(x => ERR('fail'));

// asyncChain — returns Promise<ChainResult>
const asyncResult = await asyncChain(() => Promise.resolve(42));
expectType<ChainResult<number, any>>(asyncResult);

// asyncChain with value
const asyncFromValue = await asyncChain(42);
expectType<ChainResult<number, any>>(asyncFromValue);

// Chain async operations
const step1 = await asyncChain(() => Promise.resolve(10));
const step2 = await step1.asyncChain(async x => Promise.resolve(x * 2));
const step3 = await step2.asyncChain(async x => Promise.resolve(x + 5));
expectType<ChainResult<number, any>>(step3);