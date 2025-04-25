import express from 'express'
import dbInit from './models/dbInit.js';
import env from 'dotenv';
import router from './routes/route.js';

env.config();

let app= express();
app.use(express.json());

dbInit();

app.use('/api/client', router);

let port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`API is running at ${port}`);

  });
  