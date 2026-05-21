import test from 'node:test';
import assert from 'node:assert/strict';
import { OK, ERR, toResult } from '../index.js';

test('Basic Result creation', () => {
    const res = OK('data');
    assert.equal(res.value, 'data');
    assert.equal(res.ok, true);
    assert.equal(res.notOk, false);
});

test('Error creation', () => {
    const res = ERR('fail');
    assert.equal(res.error, 'fail');
    assert.equal(res.ok, false);
	 assert.equal(res.notOk, true);
});

test('init callback', () => {
    const res = OK(10, {
        init: (r) => { r.custom = true; }
    });
    assert.equal(res.custom, true);
});
