import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeOptions, parseArgs, bindThis } from '../utils.js';

test('normalizeOptions returns same object reference for object input', () => {
    const obj = { a: 1, b: 2 };
    const result = normalizeOptions(obj);
    assert.strictEqual(result, obj);
});

test('normalizeOptions returns shared emptyObject for null', () => {
    const result = normalizeOptions(null);
    assert.deepEqual(result, {});
});

test('normalizeOptions returns shared emptyObject for undefined', () => {
    const result = normalizeOptions(undefined);
    assert.deepEqual(result, {});
});

test('normalizeOptions returns shared emptyObject for non-object', () => {
    const result1 = normalizeOptions('string');
    const result2 = normalizeOptions(123);
    const result3 = normalizeOptions(true);
    
    assert.deepEqual(result1, {});
    assert.deepEqual(result2, {});
    assert.deepEqual(result3, {});
});

test('parseArgs returns same array reference for array input', () => {
    const args = [1, 2, 3];
    const result = parseArgs(args);
    assert.strictEqual(result, args);
});

test('parseArgs returns empty array for null', () => {
    const result = parseArgs(null);
    assert.deepEqual(result, []);
});

test('parseArgs returns empty array for undefined', () => {
    const result = parseArgs(undefined);
    assert.deepEqual(result, []);
});

test('parseArgs throws for non-array, non-null, non-undefined', () => {
    assert.throws(() => parseArgs('not array'), /invokeArgs must be array or undefined/);
    assert.throws(() => parseArgs(123), /invokeArgs must be array or undefined/);
    assert.throws(() => parseArgs({}), /invokeArgs must be array or undefined/);
});

test('bindThis binds method to context', () => {
    const obj = { value: 42 };
    function getValue() {
        return this.value;
    }
    const bound = bindThis(getValue, obj, null);
    assert.equal(bound(), 42);
});

test('bindThis returns fallback when method is not a function', () => {
    const result = bindThis(null, {}, 'fallback');
    assert.equal(result, 'fallback');
    
    const result2 = bindThis(undefined, {}, 'fallback2');
    assert.equal(result2, 'fallback2');
    
    const result3 = bindThis('not function', {}, 'fallback3');
    assert.equal(result3, 'fallback3');
});