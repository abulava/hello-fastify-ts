import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fastifyReact from '@fastify/react/plugin'

export default defineConfig({
  plugins: [react(), fastifyReact()],
})
