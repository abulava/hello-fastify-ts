import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper'

test('example is loaded', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/api/example',
  })

  assert.equal(JSON.parse(res.payload).message, 'This is an Example')
})
