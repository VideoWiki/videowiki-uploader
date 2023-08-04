const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://qbee.video.wiki",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
