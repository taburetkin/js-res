import test from 'node:test';
import assert from 'node:assert/strict';
import { OK, ERR, RES } from '../../index.js';

test('RES returns same instance for Result objects', () => {
    const original = OK('keep');
    const wrapped = RES(original);
    assert.strictEqual(original, wrapped);
});

test('RES with isFromCatchBlock=false wraps value as OK', () => {
    const res = RES('hello', {}, false);
    assert.ok(res.ok);
    assert.equal(res.value, 'hello');
});

test('RES with isFromCatchBlock=true wraps value as ERR', () => {
    const res = RES('error message', {}, true);
    assert.ok(res.notOk);
    assert.equal(res.error, 'error message');
});

test('RES with isFromCatchBlock=false and null', () => {
    const res = RES(null, {}, false);
    assert.ok(res.ok);
    assert.equal(res.value, null);
});

test('RES with isFromCatchBlock=true and null', () => {
    const res = RES(null, {}, true);
    assert.ok(res.notOk);
    assert.equal(res.error, null);
});

test('RES with isFromCatchBlock=false and undefined', () => {
    const res = RES(undefined, {}, false);
    assert.ok(res.ok);
    assert.equal(res.value, undefined);
});

test('RES with isFromCatchBlock=true and undefined', () => {
    const res = RES(undefined, {}, true);
    assert.ok(res.notOk);
    assert.equal(res.error, undefined);
});

test('RES with default options (isFromCatchBlock defaults to false)', () => {
    const res = RES('hello');
    assert.ok(res.ok);
    assert.equal(res.value, 'hello');
});

test('RES with ERR instance', () => {
    const err = ERR('fail');
    const res = RES(err);
    assert.strictEqual(err, res);
});