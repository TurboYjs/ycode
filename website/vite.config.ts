import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // css: {
  //   postcss: {
  //     plugins: [
  //       require('postcss-import'),
  //       // eslint-disable-next-line @typescript-eslint/no-var-requires
  //       require('postcss-nested')({
  //         bubble: ['screen'],
  //       }),
  //     ],
  //   },
  // },
  base: '/interview/',
  server: {
    port: 8080
  },
  resolve: {
    alias: {
      /* ... */
      '~': resolve(__dirname, './src'),
      '~components': resolve(__dirname, './src/components'),
      '~store': resolve(__dirname, './src/store'),
      '~utils': resolve(__dirname, './src/utils'),
      '~constant': resolve(__dirname, './src/constant'),
      '~hooks': resolve(__dirname, './src/hooks'),
      '~pages': resolve(__dirname, './src/pages'),
      '~services':  resolve(__dirname, './src/services'),
      '~ext':  resolve(__dirname, './src/ext'),
    },
  }
})
