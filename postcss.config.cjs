module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-pxtorem',  {
      rootValue: 16,
      propList: ['*'],
    }),
    require('postcss-import'),
    require('postcss-nested')({
      bubble: ['screen'],
    }),
  ]
};
