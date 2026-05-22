import test from 'node:test';
import assert from 'node:assert/strict';
import { Results, Result } from '../../index.js';

class MyResult extends Result {
    timestamp = Date.now();
    isCustom = true;
}

class MyLib extends Results {
    Class = MyResult;
}

test('Results.OK creates instance of custom Class', () => {
    const lib = new MyLib();
    const res = lib.OK('test');
    
    assert.ok(res instanceof MyResult);
    assert.equal(res.isCustom, true);
    assert.equal(res.value, 'test');
});

test('Results.ERR creates instance of custom Class', () => {
    const lib = new MyLib();
    const res = lib.ERR('fail');
    
    assert.ok(res instanceof MyResult);
    assert.equal(res.isCustom, true);
    assert.equal(res.error, 'fail');
    assert.equal(res.ok, false);
    assert.equal(res.notOk, true);
});

test('Results.sync returns custom Result instance', () => {
    const lib = new MyLib();
    const res = lib.sync(() => 'hello');
    
    assert.ok(res instanceof MyResult);
    assert.equal(res.value, 'hello');
    assert.ok(typeof res.timestamp === 'number');
});

test('Results.async returns custom Result instance', async () => {
    const lib = new MyLib();
    const res = await lib.async(Promise.resolve('async'));
    
    assert.ok(res instanceof MyResult);
    assert.equal(res.value, 'async');
    assert.ok(res.isCustom);
});

test('Results.safeInvoke returns tuple (not custom Result)', () => {
    const lib = new MyLib();
    const [val, err] = lib.safeInvoke(() => 42);
    
    assert.equal(val, 42);
    assert.equal(err, undefined);
});

test('Results can override normalizeOptions', () => {
    class CustomLib extends Results {
        normalizeOptions(obj) {
            return { ...super.normalizeOptions(obj), custom: true };
        }
    }
    
    const lib = new CustomLib();
    const res = lib.OK('test');
    
    assert.ok(res.ok);
    assert.equal(res.value, 'test');
});