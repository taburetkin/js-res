import test from 'node:test';
import assert from 'node:assert/strict';
import { asyncCall } from '../../index.js';

test('asyncCall resolves Promise to OK', async () => {
    const res = await asyncCall(Promise.resolve('done'));
    assert.ok(res.ok);
    assert.equal(res.value, 'done');
});

test('asyncCall rejects Promise to ERR', async () => {
    const res = await asyncCall(Promise.reject('fail'));
    assert.ok(res.notOk);
    assert.equal(res.error, 'fail');
});

test('asyncCall with function returning Promise', async () => {
    const res = await asyncCall(async () => 'async work');
    assert.ok(res.ok);
    assert.equal(res.value, 'async work');
});

test('asyncCall catches immediate throw from function', async () => {
    const res = await asyncCall(() => { throw 'immediate fail'; });
    assert.ok(res.notOk);
    assert.equal(res.error, 'immediate fail');
});

test('asyncCall with non-function non-Promise returns OK', async () => {
    const res = await asyncCall(42);
    assert.ok(res.ok);
    assert.equal(res.value, 42);
    
    const res2 = await asyncCall('string');
    assert.ok(res2.ok);
    assert.equal(res2.value, 'string');
    
    const res3 = await asyncCall(null);
    assert.ok(res3.ok);
    assert.equal(res3.value, null);
});

test('asyncCall with function that returns non-Promise', async () => {
    const res = await asyncCall(() => 'direct value');
    assert.ok(res.ok);
    assert.equal(res.value, 'direct value');
});

test('asyncCall respects invokeContext', async () => {
    const ctx = { prefix: 'Hello ' };
    async function fn(name) {
        return this.prefix + name;
    }
    const res = await asyncCall(fn, { invokeContext: ctx, invokeArgs: ['World'] });
    assert.ok(res.ok);
    assert.equal(res.value, 'Hello World');
});

test('asyncCall respects invokeArgs', async () => {
    const fn = async (a, b) => a + b;
    const res = await asyncCall(fn, { invokeArgs: [5, 10] });
    assert.ok(res.ok);
    assert.equal(res.value, 15);
});

test('asyncCall with Promise that resolves to undefined', async () => {
    const res = await asyncCall(Promise.resolve(undefined));
    assert.ok(res.ok);
    assert.equal(res.value, undefined);
});

test('asyncCall with Promise that rejects with undefined', async () => {
    const res = await asyncCall(Promise.reject(undefined));
    assert.ok(res.notOk);
    assert.equal(res.error, undefined);
});