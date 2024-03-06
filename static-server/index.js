import path from 'path';
import express from 'express';
import cors from 'cors';

const app = express();

const PORT = 80;

app.use(express.static('dist'));

app.use(cors({ credentials: true, origin: true }));

app.get('*', (req, res) => {
	res.sendFile(path.resolve('dist/index.html'));
});

app.listen(PORT);
