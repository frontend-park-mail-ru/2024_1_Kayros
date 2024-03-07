import path from 'path';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { fileURLToPath } from 'url';
import proxy from 'express-http-proxy';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HTTP_PORT = 80;
const HTTPS_PORT = 443;

var privateKey = fs.readFileSync(path.resolve(__dirname, 'sslcert/server.key'), 'utf8');
var certificate = fs.readFileSync(path.resolve(__dirname, 'sslcert/server.crt'), 'utf8');

var credentials = { key: privateKey, cert: certificate };

app.use('/api', proxy('http://localhost:8000'));
app.use(express.static('dist'));

app.get('*', (req, res) => {
	res.sendFile(path.resolve('dist/index.html'));
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(HTTP_PORT);
httpsServer.listen(HTTPS_PORT);
