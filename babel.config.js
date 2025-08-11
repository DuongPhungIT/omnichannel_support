module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 🔧 Bắt buộc cho React Navigation + Reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
