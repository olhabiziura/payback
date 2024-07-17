const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // This is the API prefix that the proxy will look for to forward requests
    createProxyMiddleware({
      target: 'http://your-api-server.com', // The backend server you're making requests to
      changeOrigin: true,
    })
  );
};