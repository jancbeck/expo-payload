module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    overrides: [
      {
        test: [/@payloadcms/, /payload/, /prettier/],
        plugins: [
          // we can't use unstable_transformImportMeta: true, it won't work with import.meta.url that payload uses
          'babel-plugin-transform-import-meta',
          // we need this or else we get `ReactServerError: Cannot access '_require' before initialization]` errors
          'module:@reactioncommerce/babel-remove-es-create-require',
        ],
      },
    ],
  };
};
