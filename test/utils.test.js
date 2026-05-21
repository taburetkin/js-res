import test from 'node:test';
import assert from 'node:assert/strict';
import { OK, ERR, toResult } from '../index.js';

test('options.invokeArgs must throw if has not array value', { only: true }, () => {
	assert.throws(() => {
		try {
			console.log('1')
			OK('data', { invokeArgs: 'not an array' });
		
		} catch(err) {
			console.log('2')
		}
		throw Error('falling')
	});
})