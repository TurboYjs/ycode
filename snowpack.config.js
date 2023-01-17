module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
    ['@snowpack/plugin-webpack', { htmlMinifierOptions: false }],
    '@snowpack/plugin-postcss',
  ],
  install: [
    /* ... */
  ],
  installOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
    tailwindConfig: './tailwind.config.js',
  },
  buildOptions: {
    baseUrl: '/ycode/',
  },
  proxy: {
    /* ... */
  },
  alias: {
    /* ... */
    '~': './src',
    '~components': './src/components',
    '~store': './src/store',
    '~utils': './src/utils',
    '~constant': './src/constant',
    '~hooks': './src/hooks',
    '~pages': './src/pages',
    '~services':  './src/services',
    '~ext':  './src/ext',
  },
};
