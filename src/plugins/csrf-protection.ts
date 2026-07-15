import fp from 'fastify-plugin'
import fastifyCsrf, { FastifyCsrfProtectionOptions } from '@fastify/csrf-protection'

export default fp<FastifyCsrfProtectionOptions>(
  async (fastify) => {
    await fastify.register(fastifyCsrf, { sessionPlugin: '@fastify/cookie' })

    fastify.addHook('preValidation', (request, reply, done) => {
      const unsafeMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

      if (unsafeMethods.includes(request.method)) {
        if (process.env.NODE_ENV === 'test') {
          done()
          return
        }

        fastify.csrfProtection(request, reply, done)
      } else {
        done()
      }
    })
  },
  {
    name: 'global-csrf',
    dependencies: ['global-cookie', 'global-sensible'],
  }
)
