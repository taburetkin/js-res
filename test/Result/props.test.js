import test from 'node:test';
import assert from 'node:assert/strict';
import { Result, OK, ERR } from '../../index.js';

test('Result.ok returns true when error is null and forcedError is false', () => {
    const res = new Result('value', null, false);
    assert.equal(res.ok, true);
    assert.equal(res.notOk, false);
});

test('Result.ok returns false when forcedError is true', () => {
    const res = new Result('value', null, true);
    assert.equal(res.ok, false);
    assert.equal(res.notOk, true);
});

test('Result.ok returns false when error exists', () => {
    const res = new Result(undefined, 'error', false);
    assert.equal(res.ok, false);
    assert.equal(res.notOk, true);
});

test('Result.value returns the success value', () => {
    const res = new Result(42, null);
    assert.equal(res.value, 42);
});

test('Result.error returns the error value', () => {
    const res = new Result(undefined, 'fail');
    assert.equal(res.error, 'fail');
});

test('Result.forcedError is accessible', () => {
    const res1 = new Result('data', null, true);
    assert.equal(res1.forcedError, true);
    
    const res2 = new Result('data', null, false);
    assert.equal(res2.forcedError, false);
    
    const res3 = new Result('data', null);
    assert.equal(res3.forcedError, false);
});

test('Result.match exists and is a function', () => {
    const res = OK('test');
    assert.equal(typeof res.match, 'function');
});

test('Result.fold exists and is a function', () => {
    const res = OK('test');
    assert.equal(typeof res.fold, 'function');
});