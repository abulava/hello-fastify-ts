import { type FastifyPluginAsync } from 'fastify'

const example: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get('/', async function (_request, _reply) {
    return { message: 'This is an Example' }
  })
}

export default example
