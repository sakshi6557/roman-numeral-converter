// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react'


// // https://vite.dev/config/
// export default defineConfig({
  
//   const env = loadEnv(mode, process.cwd(), '')
//   plugins: [react()],
//   server: {
//     port: 8081,
//   },
// })

// import { defineConfig, loadEnv } from 'vite'
// import { fileURLToPath, URL } from 'node:url'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '')

//   return {
//     plugins: [react()],
//     server: {
//       port: 8081,
//     },
//   }
// })

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    define: {
      // Optional: make custom env variables available globally
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV),
    },
    server: {
      port: 8081,
    },
  }
})
