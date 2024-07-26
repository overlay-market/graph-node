import * as http from 'http';
import * as https from 'https';
import httpProxy from 'http-proxy';

const targetUrl = 'https://mevm.testnet.imola.movementlabs.xyz';

const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  changeOrigin: true,
  secure: true,
  agent: new https.Agent({
    rejectUnauthorized: false
  })
});

const server = http.createServer((req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    console.log('Request URL:', req.url);
    console.log('Request Body:', body);

    // Redirigir la solicitud al nodo Ethereum real
    req.headers['content-length'] = Buffer.byteLength(body).toString();

    // Agregar el cuerpo al req para accederlo en el evento proxyReq
    (req as any).body = body;

    proxy.web(req, res, {
      target: targetUrl,
      changeOrigin: true,
      secure: true,
      agent: new https.Agent({
        rejectUnauthorized: false
      })
    }, (error) => {
      console.error('Proxy error:', error);
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end('Something went wrong.');
    });
  });
});

// Manejar eventos del proxy
proxy.on('proxyReq', (proxyReq, req) => {
  const body = (req as any).body;
  if (req.method === 'POST' && body) {
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(body));
    proxyReq.write(body);
  }
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (res instanceof http.ServerResponse) {
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Something went wrong.');
  }
});

console.log('Proxy listening on port 8080');
server.listen(8080);
