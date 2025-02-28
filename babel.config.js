module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
        },
      ],
      "nativewind/babel",
    ],

    overrides: [
      {
        test: [/@payloadcms/, /payload/, /prettier/],
        plugins: [
          "babel-plugin-transform-import-meta",
          "module:@reactioncommerce/babel-remove-es-create-require",
        ],
      },
    ],

    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],

          alias: {
            "@": "./",
            "tailwind.config": "./tailwind.config.js",
          },
        },
      ],
    ],
  };
};
