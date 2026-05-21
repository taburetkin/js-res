import test from 'node:test';
import assert from 'node:assert/strict';
import { Results, Result } from '../index.js';

class MyResult extends Result {
    isCustom = true;
}

class MyLib extends Results {
    Class = MyResult;
}

test('Should use custom class in polymorphism', () => {
    const lib = new MyLib();
    const res = lib.OK('test');
    
    assert.ok(res instanceof MyResult);
    assert.equal(res.isCustom, true);
});

test('Should preserve context in sync calls', () => {
    const lib = new MyLib();
    const res = lib.sync(() => 'hello');
    
    assert.ok(res instanceof MyResult);
    assert.equal(res.value, 'hello');
});
