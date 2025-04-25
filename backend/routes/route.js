
import { addClient } from "../controllers/clientsController.js";
import express from 'express'

let router=express.Router()

router.post('/adauga-client', addClient);

export default router;