const path = require("path");

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    "@components": path.resolve(__dirname, "src/components"),
    "@context": path.resolve(__dirname, "src/context"),
    "@api": path.resolve(__dirname, "src/api"),
    "@styles": path.resolve(__dirname, "src/styles"),
    "@assets": path.resolve(__dirname, "src/assets"),
    "@routes": path.resolve(__dirname, "src/routes"),
    "@layouts": path.resolve(__dirname, "src/layouts"),
  };
  return config;
};
