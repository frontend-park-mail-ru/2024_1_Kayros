import express from 'express';
import path from 'path';
// import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const PORT = 80;

app.use(express.static('dist'));

// const proxyMiddleware = createProxyMiddleware({
// 	target: 'api',
// 	router: (req) => {
// 		return 'http://localhost:8000';
// 	},
// });
//
// app.use(proxyMiddleware);

app.get('*', (req, res) => {
	res.sendFile(path.resolve('dist/index.html'));
});

app.listen(PORT);
