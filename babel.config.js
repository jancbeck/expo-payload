module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    overrides: [
      {
        test: [/@payloadcms/, /payload/, /prettier/, /uploadthing/],
        plugins: [
          "babel-plugin-transform-import-meta",
          "module:@reactioncommerce/babel-remove-es-create-require",
        ],
      },
    ],
  };
};
