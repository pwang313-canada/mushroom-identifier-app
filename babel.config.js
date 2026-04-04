module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',      // 原有的 expo preset
    ],
    // 如果还有其他 plugins，也保留
  };
};
