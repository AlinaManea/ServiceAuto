
import { addClient, getAllClients,getClientById,getClientsByStatus, updateClient,deleteClient,deactivateClient,reactivateClient,addCar,
    getCarsByClient, updateCar, deleteCar, getCarById, searchCars,filterCarsByYear
} from "../controllers/clientsController.js";
import express from 'express'

let routerClient=express.Router()

//client
routerClient.post('/adauga-client', addClient);
routerClient.get('/toti-clientii', getAllClients);
routerClient.get('/:id',getClientById)
routerClient.get('/:status', getClientsByStatus);
routerClient.put('/:id', updateClient); 
routerClient.delete('/:id', deleteClient); 
routerClient.patch('/inactivare/:id', deactivateClient); 
routerClient.patch('/reactivare/:id', reactivateClient); 
//masina
routerClient.post('/:idClient/masini', addCar);
routerClient.get('/masini/search', searchCars);
routerClient.get('/masini/filter', filterCarsByYear);
routerClient.get('/masini/:idClient', getCarsByClient);
// routerClient.get('/masini/in-service', getAllCarsInService);
routerClient.put('/masini/:idCar', updateCar);
routerClient.delete('/masini/:idCar', deleteCar);
routerClient.get('/masini/:idCar', getCarById);

export default routerClient;