import { test } from 'node:test'
import assert from 'node:assert'
import Fastify from 'fastify'
import app from '../../src/app'

test('Global CSRF protection should be active and work correctly', async () => {
  const originalEnv = process.env.NODE_ENV
  const originalSecret = process.env.SESSION_SECRET

  process.env.NODE_ENV = 'production'
  process.env.SESSION_SECRET = 'test-secret-key-for-csrf-test'

  const fastify = Fastify()

  // Register the REAL application (with all plugins via autoload)
  // and test routes in ONE nested context,
  // so that csrf-protection hooks (preValidation) are inherited by the test routes.
  await fastify.register(async (instance) => {
    await instance.register(app)
    instance.get('/_test/csrf', async () => ({ test: 'get_ok' }))
    instance.post('/_test/csrf', async () => ({ test: 'post_ok' }))
  })

  await fastify.ready()

  try {
    // --- STEP 1: Block request without token ---
    const badResponse = await fastify.inject({
      method: 'POST',
      url: '/_test/csrf',
      payload: { data: 'test' },
    })

    console.log('DEBUG badResponse status:', badResponse.statusCode)
    console.log('DEBUG badResponse body:', badResponse.body)
    console.log('DEBUG badResponse headers:', JSON.stringify(badResponse.headers))

    assert.strictEqual(badResponse.statusCode, 403, 'Request without token should be rejected')

    // --- STEP 2: Successful pass with token ---
    const getResponse = await fastify.inject({
      method: 'GET',
      url: '/_test/csrf',
    })

    const setCookieHeader = getResponse.headers['set-cookie']
    assert.ok(setCookieHeader, 'Server should return cookies')

    const cookies = Array.isArray(setCookieHeader)
      ? setCookieHeader.map((c) => c.split(';')[0]).join('; ')
      : setCookieHeader.split(';')[0]

    const csrfToken = getResponse.headers['x-csrf-token']

    const goodResponse = await fastify.inject({
      method: 'POST',
      url: '/_test/csrf',
      headers: {
        cookie: cookies,
        'x-csrf-token': csrfToken,
      },
      payload: { data: 'test' },
    })

    assert.strictEqual(goodResponse.statusCode, 200, 'Request with valid token should pass')
    assert.deepStrictEqual(JSON.parse(goodResponse.body), { test: 'post_ok' })
  } finally {
    process.env.NODE_ENV = originalEnv
    process.env.SESSION_SECRET = originalSecret
    await fastify.close()
  }
})
