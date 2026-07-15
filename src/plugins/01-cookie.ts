import fp from 'fastify-plugin'
import fastifyCookie, { FastifyCookieOptions } from '@fastify/cookie'

export default fp<FastifyCookieOptions>(
  async (fastify) => {
    const secret = process.env.SESSION_SECRET

    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error('PRODUCTION CRITICAL: SESSION_SECRET env variable is missing!')
    }

    await fastify.register(fastifyCookie, {
      secret: secret || 'temporary-dev-secret-key-for-local-node-session',
    })
  },
  {
    name: 'global-cookie',
  }
)
