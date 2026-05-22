import test from 'node:test';
import assert from 'node:assert/strict';
import { OK, ERR, syncCall, asyncCall, safeInvoke } from '../index.js';

test('init hook modifies Result after creation (OK)', () => {
    const res = OK(10, {
        init: (r) => { r.custom = true; r.multiplied = r.value * 2; }
    });
    assert.equal(res.custom, true);
    assert.equal(res.multiplied, 20);
    assert.equal(res.value, 10);
});

test('init hook modifies Result after creation (ERR)', () => {
    const res = ERR('error', {
        init: (r) => { r.timestamp = 123; }
    });
    assert.equal(res.timestamp, 123);
    assert.equal(res.error, 'error');
});

test('init hook adds multiple properties', () => {
    const res = OK('data', {
        init: (r) => {
            r.field1 = 1;
            r.field2 = 'two';
        }
    });
    assert.equal(res.field1, 1);
    assert.equal(res.field2, 'two');
    assert.equal(res.value, 'data');
});

test('invokeContext provides this context for function', () => {
    const ctx = { name: 'TestContext' };
    function fn() {
        return this.name;
    }
    const res = syncCall(fn, { invokeContext: ctx });
    assert.ok(res.ok);
    assert.equal(res.value, 'TestContext');
});

test('invokeArgs passes arguments to function', () => {
    const fn = (a, b) => a + b;
    const res = syncCall(fn, { invokeArgs: [5, 10] });
    assert.equal(res.value, 15);
});

test('invokeArgs with single argument', () => {
    const fn = (x) => x * 2;
    const res = syncCall(fn, { invokeArgs: [21] });
    assert.equal(res.value, 42);
});

test('invokeArgs with no arguments', () => {
    const fn = () => 42;
    const res = syncCall(fn, { invokeArgs: [] });
    assert.equal(res.value, 42);
});

test('invokeArgs with undefined (defaults to empty array)', () => {
    const fn = () => 42;
    const res = syncCall(fn, { invokeArgs: undefined });
    assert.equal(res.value, 42);
});

test('combine invokeContext and invokeArgs', () => {
    const ctx = { multiplier: 2 };
    function fn(val) {
        return val * this.multiplier;
    }
    const res = syncCall(fn, { invokeContext: ctx, invokeArgs: [10] });
    assert.equal(res.value, 20);
});

test('options in asyncCall with invokeContext', async () => {
    const ctx = { suffix: '!' };
    async function fn(msg) {
        return msg + this.suffix;
    }
    const res = await asyncCall(fn, { invokeContext: ctx, invokeArgs: ['Hello'] });
    assert.ok(res.ok);
    assert.equal(res.value, 'Hello!');
});

test('options in safeInvoke with invokeArgs', () => {
    const [val, err] = safeInvoke((a, b) => a * b, { invokeArgs: [6, 7] });
    assert.equal(val, 42);
    assert.equal(err, undefined);
});