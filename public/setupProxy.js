import { createServer } from 'http';
import { createProxyServer } from 'http-proxy';

const proxy = createProxyServer({
  target: 'http://localhost:9090',
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  }
});

const server = createServer((req, res) => {
  proxy.web(req, res);
});

server.listen(5173, () => {
  console.log('Proxy server is running on http://localhost:3000');
});