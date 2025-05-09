import { 
    createCarPart, 
    getAllCarParts, 
    getCarPartById, 
    updateCarPart, 
    deleteCarPart, 
    updateCarPartStock ,
    disableCarPart,
    enableCarPart
} from "../controllers/piesaController.js";
import express from 'express';

let routerPiese = express.Router();

routerPiese.post('/adauga-piesa', createCarPart);
routerPiese.get('/toate-piesele', getAllCarParts);
routerPiese.get('/:idPart', getCarPartById);
routerPiese.put('/:idPart', updateCarPart);
routerPiese.delete('/:idPart', deleteCarPart);
routerPiese.patch('/:idPart/stoc', updateCarPartStock);
routerPiese.patch('/:idPart/disable', disableCarPart);
routerPiese.patch('/:idPart/enable', enableCarPart);

export default routerPiese;
