module.exports = function(api) {
  api.cache(true);
  return {
    plugins: [
      '@babel/plugin-transform-classes',
      '@babel/plugin-transform-parameters'
    ],
  };
};