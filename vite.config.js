import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fastifyReact from '@fastify/react/plugin'

export default defineConfig({
  root: resolve(import.meta.dirname, 'client'),
  build: { outDir: resolve(import.meta.dirname, 'dist') },
  plugins: [react(), fastifyReact()],
})
