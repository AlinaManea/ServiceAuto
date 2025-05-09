import express from 'express';
import {
    addIstoricService,
    processingIstoricService,
    finalizeReparatie,
    getIstoricByAppointment,
    getIstoricByCar,
    getIstoricByClient,
    updateIstoricPrimire,
    updateProcessingIstoricService,
    getTotalCost
} from '../controllers/istoricController.js';

let routerIstoric = express.Router();

routerIstoric.post('/adauga', addIstoricService);
routerIstoric.put("/:idAppointment", updateIstoricPrimire);
routerIstoric.post('/procesare', processingIstoricService);
routerIstoric.put('/update/:idIstoric', updateProcessingIstoricService);
routerIstoric.put('/finalizare/:idIstoric', finalizeReparatie);
routerIstoric.get('/programare/:idAppointment', getIstoricByAppointment);
routerIstoric.get('/masina/:idCar', getIstoricByCar);
routerIstoric.get('/client/:idClient', getIstoricByClient);

//BONUS
routerIstoric.get('/cost-total-7-zile', getTotalCost);


export default routerIstoric;
