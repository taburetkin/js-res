import test from 'node:test';
import assert from 'node:assert/strict';
import { syncCall } from '../../index.js';

test('syncCall returns OK on success', () => {
    const res = syncCall(() => 'work');
    assert.ok(res.ok);
    assert.equal(res.value, 'work');
});

test('syncCall returns ERR on throw', () => {
    const res = syncCall(() => { throw new Error('crash'); });
    assert.ok(res.notOk);
    assert.equal(res.error.message, 'crash');
});

test('syncCall with non-function returns OK of the value', () => {
    const res = syncCall(42);
    assert.ok(res.ok);
    assert.equal(res.value, 42);
    
    const res2 = syncCall('hello');
    assert.ok(res2.ok);
    assert.equal(res2.value, 'hello');
    
    const res3 = syncCall(null);
    assert.ok(res3.ok);
    assert.equal(res3.value, null);
});

test('syncCall respects invokeContext', () => {
    const ctx = { multiplier: 2 };
    function fn(val) {
        return val * this.multiplier;
    }
    const res = syncCall(fn, { invokeContext: ctx, invokeArgs: [10] });
    assert.equal(res.value, 20);
});

test('syncCall respects invokeArgs', () => {
    const fn = (a, b) => a + b;
    const res = syncCall(fn, { invokeArgs: [5, 10] });
    assert.equal(res.value, 15);
});

test('syncCall with empty options', () => {
    const res = syncCall(() => 42, {});
    assert.ok(res.ok);
    assert.equal(res.value, 42);
});

test('syncCall catches error with custom error type', () => {
    const res = syncCall(() => { throw 404; });
    assert.ok(res.notOk);
    assert.equal(res.error, 404);
});