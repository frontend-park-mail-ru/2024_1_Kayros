import path from 'path';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import request from 'request';

const app = express();

const PORT = 80;

app.use(express.static('dist'));

//const proxyMiddleware = createProxyMiddleware({
//	target: 'api/',
//	router: (req) => {
//		return 'http://localhost:8000';
//	},
//});
//
//app.use(proxyMiddleware);

app.use('/api', function (req, res) {
	req.pipe(request('http://foo.com/api' + req.url)).pipe(res);
});

app.get('*', (req, res) => {
	res.sendFile(path.resolve('dist/index.html'));
});

app.listen(PORT);
