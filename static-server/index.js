import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import proxy from 'express-http-proxy';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HTTP_PORT = 80;
const HTTPS_PORT = 443;

const privateKey = fs.readFileSync(path.resolve(__dirname, '..', '..', 'sslcert/server.key'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, '..', '..', 'sslcert/server.crt'), 'utf8');

const credentials = { key: privateKey, cert: certificate };

app.use((req, res, next) => {
	if (!req.secure) {
		return res.redirect(`https://${req.headers.host + req.url}`);
	}

	next();
});

app.use('/api', proxy('http://localhost:8000'));
app.use(express.static('dist'));

app.get('*', (req, res) => {
	res.sendFile(path.resolve('dist/index.html'));
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(HTTP_PORT);
httpsServer.listen(HTTPS_PORT);
