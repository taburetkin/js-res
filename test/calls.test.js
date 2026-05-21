import test from 'node:test';
import assert from 'node:assert/strict';
import { OK, toResult, syncCall, asyncCall, safeInvoke, Result } from '../index.js';

test('--- toResult: Conversion Logic ---', async (t) => {

    await t.test('Should return the same instance if already a Result', () => {
        const first = OK('success');
        const second = toResult(first, {}, true); // isFromCatchBlock flag should not wrap it again
        assert.strictEqual(first, second);
    });

    await t.test('Should create ERR if isFromCatchBlock signal is true', () => {
        const data = "unexpected string error";
        const res = toResult(data, {}, true);
        assert.ok(res.notOk);
        assert.equal(res.error, data);
    });

    await t.test('Should create OK by default for regular values', () => {
        const res = toResult('hello');
        assert.ok(res.ok);
        assert.equal(res.value, 'hello');
    });
});

test('--- safeInvoke: Raw invocation without Result wrapper ---', () => {
    const fn = (a, b) => a + b;
    
    const [val, err] = safeInvoke(fn, { invokeArgs: [5, 10] });
    assert.equal(val, 15);
    assert.equal(err, undefined);

    const [valErr, errObj] = safeInvoke(() => { throw 'boom'; });
    assert.equal(valErr, undefined);
    assert.equal(errObj, 'boom');
});

test('--- syncCall: Synchronous calls ---', async (t) => {

    await t.test('Successful function execution', () => {
        const res = syncCall(() => 'work');
        assert.ok(res.ok);
        assert.equal(res.value, 'work');
    });

    await t.test('Should catch throw and return ERR', () => {
        const res = syncCall(() => { throw new Error('crash'); });
        assert.ok(res.notOk);
        assert.equal(res.error.message, 'crash');
    });

    await t.test('Should respect invokeContext and invokeArgs', () => {
        const ctx = { multiplier: 2 };
        function fn(val) { return val * this.multiplier; }
        
        const res = syncCall(fn, { 
            invokeContext: ctx, 
            invokeArgs: [10] 
        });
        assert.equal(res.value, 20);
    });
});

test('--- asyncCall: Asynchronous calls ---', async (t) => {

    await t.test('Successful Promise resolution', async () => {
        const res = await asyncCall(Promise.resolve('done'));
        assert.ok(res.ok);
        assert.equal(res.value, 'done');
    });

    await t.test('Rejected Promise handling', async () => {
        const res = await asyncCall(Promise.reject('fail'));
        assert.ok(res.notOk);
        assert.equal(res.error, 'fail');
    });

    await t.test('Function returning a Promise', async () => {
        const res = await asyncCall(async () => 'async work');
        assert.equal(res.value, 'async work');
    });

    await t.test('Should catch immediate throw before returning Promise', async () => {
        const res = await asyncCall(() => { throw 'immediate fail'; });
        assert.ok(res.notOk);
        assert.equal(res.error, 'immediate fail');
    });
});
