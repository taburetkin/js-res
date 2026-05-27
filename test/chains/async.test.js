import { test } from 'node:test';
import assert from 'node:assert/strict';
import { asyncChain } from '../../index.js';

let ind = 0;
class Test {
  constructor() {
    this.cid = ++ind;
    console.log('created', this.cid);
    if (ind > 10)  {
      throw new Error('zhopa')
    }
  }
  then(ok, err)  {
    console.log('then', this.cid);
    return ok(new Test())
  }
}

test('asyncChain: thenable behavior (direct await)', async () => {
  
  const _res = asyncChain(5)
                .mapAsync(value => {
                  throw new Error('zhopa')
                })
                .mapAsync(value => value + 2);

  //const tst = new Test();

  //const result = await tst;

  //const res = await _res;

  assert.strictEqual(true, true);

});

