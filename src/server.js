import express from 'express';
import env from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import fileupload from 'express-fileupload';
import bodyParser from 'body-parser';
import router from './routes';

env.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(compression());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(cors());
app.use(fileupload({
  createParentPath: true,
  useTempFiles: true,
}));

app.get('/', (req, res) => {
  res.send('Welcome to the system');
});

app.use('/api', router);

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

app.listen(PORT, () => {});
