// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
};
