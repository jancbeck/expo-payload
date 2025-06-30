// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.transformer.experimentalImportBundleSupport = true;
config.transformer.asyncRequireModulePath = require.resolve(
  "@expo/metro-runtime/async-require",
);

// Add a custom resolver for the uuid package
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  uuid: path.resolve(__dirname, "./node_modules/uuid/dist/index.js"),
};

// Add custom resolver to handle problematic packages
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Specifically intercept uuid imports
  if (moduleName === "uuid") {
    return {
      filePath: path.resolve(__dirname, "./node_modules/uuid/dist/index.js"),
      type: "sourceFile",
    };
  }
  if (moduleName === "node:sqlite") return { type: "empty" };

  // Let the default resolver handle everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
