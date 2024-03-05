import express from 'express';
import path from 'path';

const app = express();

const PORT = 8080;

app.use(express.static('dist'));

app.get('*', (req, res) => {
	res.sendFile(path.resolve('dist/index.html'));
});

app.listen(PORT);
