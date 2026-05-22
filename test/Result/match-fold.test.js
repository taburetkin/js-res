import test from 'node:test';
import assert from 'node:assert/strict';
import { OK, ERR } from '../../index.js';

test('match returns ok handler value for success', () => {
    const res = OK(42);
    const result = res.match({
        ok: (value, r) => `Success: ${value}, forced: ${r.forcedError}`,
        err: (error) => `Error: ${error}`
    });
    assert.equal(result, 'Success: 42, forced: false');
});

test('match returns err handler value for error', () => {
    const res = ERR('fail');
    const result = res.match({
        ok: (value) => `Success: ${value}`,
        err: (error, r) => `Error: ${error}, forced: ${r.forcedError}`
    });
    assert.equal(result, 'Error: fail, forced: true');
});

test('match receives result as second argument', () => {
    const res = OK(42);
    let receivedResult = null;
    res.match({
        ok: (value, r) => { receivedResult = r; return value; },
        err: (error) => error
    });
    assert.strictEqual(receivedResult, res);
});

test('fold returns onOk value for success', () => {
    const res = OK(42);
    const result = res.fold(
        (value) => value * 2,
        (error) => -1
    );
    assert.equal(result, 84);
});

test('fold returns onErr value for error', () => {
    const res = ERR('fail');
    const result = res.fold(
        (value) => value,
        (error) => error.toUpperCase()
    );
    assert.equal(result, 'FAIL');
});

test('fold receives result as second argument', () => {
    const res = OK(42);
    let receivedResult = null;
    res.fold(
        (value, r) => { receivedResult = r; return value; },
        (error) => error
    );
    assert.strictEqual(receivedResult, res);
    
    const errRes = ERR('fail');
    let receivedErrResult = null;
    errRes.fold(
        (value) => value,
        (error, r) => { receivedErrResult = r; return error; }
    );
    assert.strictEqual(receivedErrResult, errRes);
});

test('match works with complex transformations', () => {
    const res = OK({ name: 'John', age: 30 });
    const greeting = res.match({
        ok: (user) => `Hello ${user.name}, you are ${user.age}`,
        err: (error) => `Error: ${error}`
    });
    assert.equal(greeting, 'Hello John, you are 30');
});

test('fold works with complex transformations', () => {
    const res = ERR({ code: 404, message: 'Not found' });
    const errorMessage = res.fold(
        (value) => value,
        (error) => `${error.code}: ${error.message}`
    );
    assert.equal(errorMessage, '404: Not found');
});