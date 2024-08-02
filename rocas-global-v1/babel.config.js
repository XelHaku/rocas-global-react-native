module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],

    plugins: [
      '@babel/plugin-transform-classes',
      '@babel/plugin-transform-parameters'
    ],
  };
};