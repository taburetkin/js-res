import test from 'node:test';
import assert from 'node:assert/strict';
import { OK, ERR } from '../../index.js';

test('OK creates success Result', () => {
    const res = OK('data');
    assert.equal(res.value, 'data');
    assert.equal(res.error, null);
    assert.equal(res.ok, true);
    assert.equal(res.notOk, false);
});

test('ERR creates error Result', () => {
    const res = ERR('fail');
    assert.equal(res.value, undefined);
    assert.equal(res.error, 'fail');
    assert.equal(res.ok, false);
    assert.equal(res.notOk, true);
});

test('OK with undefined value', () => {
    const res = OK(undefined);
    assert.ok(res.ok);
    assert.equal(res.value, undefined);
});

test('ERR with undefined error', () => {
    const res = ERR(undefined);
    assert.ok(res.notOk);
    assert.equal(res.error, undefined);
});

test('OK with null value', () => {
    const res = OK(null);
    assert.ok(res.ok);
    assert.equal(res.value, null);
});

test('ERR with null error', () => {
    const res = ERR(null);
    assert.ok(res.notOk);
    assert.equal(res.error, null);
});

test('OK with empty options', () => {
    const res = OK('data', {});
    assert.ok(res.ok);
    assert.equal(res.value, 'data');
});

test('ERR with empty options', () => {
    const res = ERR('fail', {});
    assert.ok(res.notOk);
    assert.equal(res.error, 'fail');
});

test('OK with numeric value', () => {
    const res = OK(42);
    assert.ok(res.ok);
    assert.equal(res.value, 42);
});

test('ERR with numeric error', () => {
    const res = ERR(404);
    assert.ok(res.notOk);
    assert.equal(res.error, 404);
});

test('OK with object value', () => {
    const obj = { key: 'value' };
    const res = OK(obj);
    assert.ok(res.ok);
    assert.strictEqual(res.value, obj);
});

test('ERR with object error', () => {
    const obj = { code: 500 };
    const res = ERR(obj);
    assert.ok(res.notOk);
    assert.strictEqual(res.error, obj);
});

test('OK with init hook adds properties', () => {
    const res = OK(10, {
        init: (r) => { r.custom = true; }
    });
    assert.equal(res.custom, true);
    assert.equal(res.value, 10);
});

test('ERR with init hook adds properties', () => {
    const res = ERR('error', {
        init: (r) => { r.timestamp = 123; }
    });
    assert.equal(res.timestamp, 123);
    assert.equal(res.error, 'error');
});

test('OK with init hook adding multiple properties', () => {
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


test('ERR sets forcedError=true', () => {
    const res = ERR('fail');
    assert.equal(res.forcedError, true);
});

test('OK sets forcedError=false', () => {
    const res = OK('data');
    assert.equal(res.forcedError, false);
});

test('ERR with null sets forcedError=true and ok=false', () => {
    const res = ERR(null);
    assert.equal(res.forcedError, true);
    assert.equal(res.ok, false);
    assert.equal(res.error, null);
});