import express from 'express';
import { createAppointment,getAppointmentsByClient, getAppointmentsByCar,updateAppointment,deleteAppointment,getAppointmentsInterval } from '../controllers/appointmentsController.js';  

const routerAppointment = express.Router();

routerAppointment.post('/creare-programare', createAppointment);
routerAppointment.get('/client/:idClient', getAppointmentsByClient);
routerAppointment.get('/masina/:idCar', getAppointmentsByCar);
routerAppointment.put('/:idAppointment', updateAppointment);
routerAppointment.delete('/:idAppointment', deleteAppointment);
routerAppointment.get('/interval', getAppointmentsInterval);

export default routerAppointment;
