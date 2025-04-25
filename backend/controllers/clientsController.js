import Client from "../models/Client.js";
import Car from "../models/Car.js";
import validator from 'validator';


// POST: adaugarea unui client
export const addClient = async (req, res) => {
    try {
        const { nume, telefon, email } = req.body;

      
          if (!nume ||  !email || !telefon) {
            return res.status(400).json({ success: false, message: "Nu aveți toate câmpurile completate!" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Introduceți o adresă de email validă!" });
        }

        const existingUser = await Client.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Există deja un client asociat acestei adrese de email!" });
        }

        if (!validator.isMobilePhone(telefon, 'ro-RO')) {
            return res.status(400).json({ success: false, message: "Introduceți un număr de telefon valid!" });
        }
        const client = await Client.create({
            nume,
            telefon,
            email
        });
        res.status(201).json({message: 'Client adăugat cu succes!', client});
    } catch (error) {
     
        res.status(500).json({message: 'Eroare la adăugarea clientului.',error: error.message});
    }
};

//POST: adaugarea unei masini



export const addCar = async (req, res) => {
    try {
        const { idClient, serie, marca, model, anFabricatie, tipMotor, capacitateMotor, caiPutere } = req.body;

        const clientExist = await Client.findByPk(idClient);
        if (!clientExist) {
            return res.status(404).json({ message: 'Clientul cu acest ID nu există.' });
        }

        
        const car = await Car.create({
            idClient,
            serie,
            marca,
            model,
            anFabricatie,
            tipMotor,
            capacitateMotor,
            caiPutere,
        });

        return res.status(201).json({ message: 'Mașina a fost adăugată cu succes!', car });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Eroare la adăugarea mașinii.', error: error.message });
    }
};
