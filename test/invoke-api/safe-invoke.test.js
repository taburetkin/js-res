import test from 'node:test';
import assert from 'node:assert/strict';
import { safeInvoke } from '../../index.js';

test('safeInvoke returns [value, undefined] on success', () => {
    const fn = (a, b) => a + b;
    const [val, err] = safeInvoke(fn, { invokeArgs: [5, 10] });
    assert.equal(val, 15);
    assert.equal(err, undefined);
});

test('safeInvoke returns [undefined, error] on throw', () => {
    const [val, err] = safeInvoke(() => { throw 'boom'; });
    assert.equal(val, undefined);
    assert.equal(err, 'boom');
});

test('safeInvoke with non-function returns [value, undefined]', () => {
    const [val, err] = safeInvoke(42);
    assert.equal(val, 42);
    assert.equal(err, undefined);
    
    const [val2, err2] = safeInvoke('hello');
    assert.equal(val2, 'hello');
    assert.equal(err2, undefined);
    
    const [val3, err3] = safeInvoke(null);
    assert.equal(val3, null);
    assert.equal(err3, undefined);
});

test('safeInvoke with invokeContext', () => {
    const ctx = { multiplier: 2 };
    function fn(val) {
        return val * this.multiplier;
    }
    const [val, err] = safeInvoke(fn, { invokeContext: ctx, invokeArgs: [10] });
    assert.equal(val, 20);
    assert.equal(err, undefined);
});

test('safeInvoke with invokeArgs as array', () => {
    const fn = (a, b, c) => a + b + c;
    const [val, err] = safeInvoke(fn, { invokeArgs: [1, 2, 3] });
    assert.equal(val, 6);
    assert.equal(err, undefined);
});

test('safeInvoke with undefined invokeArgs', () => {
    const fn = () => 42;
    const [val, err] = safeInvoke(fn, { invokeArgs: undefined });
    assert.equal(val, 42);
    assert.equal(err, undefined);
});

test('safeInvoke catches error with object', () => {
    const errorObj = new Error('something wrong');
    const [val, err] = safeInvoke(() => { throw errorObj; });
    assert.equal(val, undefined);
    assert.strictEqual(err, errorObj);
});