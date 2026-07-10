module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ...agar pehle se koi plugins hain to unhe rehne do
      'react-native-reanimated/plugin', // ⚠️ ye hamesha array ka LAST item hona chahiye
    ],
  };
};