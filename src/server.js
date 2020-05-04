import express from 'express';
import env from 'dotenv';
import cors from 'cors';
import router from './routes';

env.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Welcome to the system');
});

app.use((req, res, next) => {
  const err = new Error('Page not found');
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status);
  res.json({
    status,
    error: error.message,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
