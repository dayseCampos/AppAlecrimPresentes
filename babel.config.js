// babel.config.js — ARQUIVO INTEIRO
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // SEMPRE por último
    ],
  };
};
