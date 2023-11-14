import express from 'express';

import connection from './utils/connection';

import { APP_PORT } from './config';

import router from './routes';

import errorHandler from './middleware/errorHandler';

import morgan from 'morgan';



const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use('/api',router);



app.use(errorHandler);

app.listen(APP_PORT, async () => {
    console.log(`Listening to port ${APP_PORT}`);
    await connection();
});