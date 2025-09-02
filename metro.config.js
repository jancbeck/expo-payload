// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add custom resolver to handle problematic packages
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Specifically intercept uuid imports
  if (moduleName === "uuid") {
    return {
      // payload dependency drizzle uses uuid v9. Resolve to v10 instead.
      filePath: path.resolve(__dirname, "./node_modules/uuid/dist/index.js"),
      type: "sourceFile",
    };
  }

  // Let the default resolver handle everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
