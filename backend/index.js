import express from 'express'
import dbInit from './models/dbInit.js';
import env from 'dotenv';
import routerClient from './routes/routeClient.js';
import routerAppointment from './routes/routeAppointment.js';

env.config();

let app= express();
app.use(express.json());

dbInit();

app.use('/api/client', routerClient);
app.use('/api/programari',routerAppointment)


let port = process.env.PORT || 9000;
app.listen(port, () => {
    console.log(`API is running at ${port}`);

  });
  