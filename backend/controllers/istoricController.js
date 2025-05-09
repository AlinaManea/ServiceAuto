import CarPart from "../models/Piesa.js";
import UsedPart from "../models/PiesaFolosita.js";
import IstoricService from '../models/IstoricService.js';
import Appointment from '../models/Appointment.js';
import Car from "../models/Car.js";
import Client from "../models/Client.js";
import { Op } from 'sequelize';

// PRIMIRE MASINAAA 
export const addIstoricService = async (req, res) => {
    const { idAppointment, probleme, tipServiciu } = req.body;
    
    try {
        const appointment = await Appointment.findByPk(idAppointment);
        
        if (!appointment) {
            return res.status(404).json({ message: "Această programare nu există." });
        }
        
        const idCar = appointment.idCar;
        const car = await Car.findByPk(idCar);
        
        if (!car) {
            return res.status(404).json({ message: "Mașina asociată nu există." });
        }
        
        const existingIstoric = await IstoricService.findOne({
            where: { idAppointment }
        });
        
        if (existingIstoric) {
            return res.status(409).json({
                message: "Pentru această programare există deja un istoric creat"
            });
        }
        
        const istoric = await IstoricService.create({
            idAppointment,
            probleme,
            tipServiciu,
            status: "Primire"
        });
        
        res.status(201).json(istoric);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Nu poate fi adaugata noua intrare la primire" });
    }
};

export const updateIstoricPrimire = async (req, res) => {
    const { idAppointment } = req.params;
    const { probleme, tipServiciu, status } = req.body;

    try {
        const istoric = await IstoricService.findOne({
            where: { idAppointment }
        });

        if (!istoric) {
            return res.status(404).json({ message: "Nu există un istoric pentru această programare." });
        }
        if (probleme !== undefined) istoric.probleme = probleme;
        if (tipServiciu !== undefined) istoric.tipServiciu = tipServiciu;
        if (status !== undefined) istoric.status = status;

        await istoric.save();

        res.status(200).json({ message: "Istoricul a fost actualizat cu succes.", istoric });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Eroare la actualizarea istoricului." });
    }
};

//Procesare

export const processingIstoricService = async (req, res) => {
    const { idIstoric, operatiuni, pieseSchimbate, problemeIdentificate, reparat } = req.body;

    try {
        const istoric = await IstoricService.findByPk(idIstoric);

        if (!istoric) {
            return res.status(404).json({ message: "Istoricul nu a fost găsit." });
        }

        istoric.operatiuni = operatiuni;
        istoric.pieseSchimbate = pieseSchimbate;
        istoric.problemeIdentificate = problemeIdentificate;
        istoric.reparat = reparat;
        istoric.status = "În lucru";

        await istoric.save();


        if (pieseSchimbate && pieseSchimbate.length > 0) {
            for (let part of pieseSchimbate) {
                const piesa = await CarPart.findByPk(part.idPart);

                if (!piesa) {
                    return res.status(404).json({ message: `Piesa cu ID ${part.idPart} nu a fost găsită.` });
                }

                if (piesa.stoc < part.cantitate) {
                    return res.status(400).json({ message: `Stoc insuficient pentru piesa ${piesa.denumire}. Stoc actual: ${piesa.stoc}` });
                }

                await UsedPart.create({
                    idPart: part.idPart,
                    idIstoric: idIstoric,
                    cantitate: part.cantitate,
                    pretTotal:  part.cantitate * piesa.pretUnitar

                });

                piesa.stoc -= part.cantitate;
                await piesa.save();
            }
        }


        res.status(200).json(istoric);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Eroare la actualizarea istoricului." });
    }
};


export const updateProcessingIstoricService = async (req, res) => {
    const { idIstoric } = req.params;
    const { operatiuni, pieseSchimbate, problemeIdentificate, reparat } = req.body;
    
    // Validări
    if (!idIstoric) {
        return res.status(400).json({ message: "ID-ul istoricului este obligatoriu" });
    }
    
    try {
        const istoric = await IstoricService.findByPk(idIstoric);
        
        if (!istoric) {
            return res.status(404).json({ message: "Istoricul nu a fost găsit." });
        }
    
        if (pieseSchimbate) {
            if (!Array.isArray(pieseSchimbate)) {
                return res.status(400).json({ message: "Piesele schimbate trebuie să fie un array" });
            }
            
            for (const piesa of pieseSchimbate) {
                if (!piesa.idPart || !piesa.cantitate) {
                    return res.status(400).json({ 
                        message: "Fiecare piesă trebuie să conțină idPart și cantitate" 
                    });
                }
                
                if (typeof piesa.cantitate !== 'number' || piesa.cantitate <= 0) {
                    return res.status(400).json({ 
                        message: "Cantitatea trebuie să fie un număr pozitiv" 
                    });
                }
            }
        }
       
        if (operatiuni !== undefined) {
            istoric.operatiuni = operatiuni;
        }
        
        if (pieseSchimbate !== undefined) {
            istoric.pieseSchimbate = pieseSchimbate;
        }
        
        if (problemeIdentificate !== undefined) {
            istoric.problemeIdentificate = problemeIdentificate;
        }
        
        if (reparat !== undefined) {
            if (typeof reparat !== 'boolean') {
                return res.status(400).json({ message: "Câmpul 'reparat' trebuie să fie boolean" });
            }
            istoric.reparat = reparat;
        }
        

        istoric.status = "În lucru";
        await istoric.save();
        res.status(200).json({
            success: true,
            message: "Istoricul a fost actualizat cu succes",
            data: istoric
        });
    } catch (error) {
        console.error("Eroare la actualizarea istoricului:", error);
        res.status(500).json({ 
            success: false,
            message: "Eroare la actualizarea istoricului.",
            error: error.message
        });
    }
};



export const finalizeReparatie = async (req, res) => {
    const { idIstoric } = req.params;
    const { dataFinalizare, durataReparatie } = req.body;

    const tarifPeMinut = 2;

    if (durataReparatie % 10 !== 0) {
        return res.status(400).json({
            message: "Durata reparației trebuie să fie în multiplu de 10 minute.",
        });
    }

    try {
        const istoric = await IstoricService.findByPk(idIstoric);

        if (!istoric) {
            return res.status(404).json({ message: "Istoricul nu a fost găsit." });
        }

        const programare = await Appointment.findByPk(istoric.idAppointment);

        if (!programare) {
            return res.status(404).json({ message: "Programarea asociată nu a fost găsită." });
        }

        if (new Date(dataFinalizare) < new Date(programare.dataProgramare)) {
            return res.status(400).json({
                message: "Data finalizării nu poate fi anterioară datei programării.",
            });
        }

        const pieseFolosite = await UsedPart.findAll({ where: { idIstoric } });
        const costPiese = pieseFolosite.reduce((total, piesa) => {
            return total + (piesa.pretTotal || 0);
        }, 0);

        const costManopera = durataReparatie * tarifPeMinut;
        const pretFinal = costPiese + costManopera;

        istoric.dataFinalizare = dataFinalizare;
        istoric.durataReparatie = durataReparatie;
        istoric.pretFinal = pretFinal;
        istoric.status = "Reparat";
        istoric.reparat = true;

        await istoric.save();

        res.status(200).json({
            message: "Mașina a fost reparată!",
            istoric,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Eroare la finalizarea reparației.",
            error: error.message,
        });
    }
};
 

export const getIstoricByAppointment = async (req, res) => {
    const { idAppointment } = req.params;

    try {
        const istoric = await IstoricService.findOne({
            where: { idAppointment: idAppointment },
        });

        if (!istoric) {
            return res.status(404).json({ message: "Istoricul pentru această programare nu a fost găsit." });
        }

        res.status(200).json(istoric);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Eroare la obținerea istoricului." });
    }
};


export const getIstoricByCar = async (req, res) => {
    const { idCar } = req.params;

    try {
        const car = await Car.findByPk(idCar);

        if (!car) {
            return res.status(404).json({ message: "Aeasta mașina nu a fost găsită." });
        }
        const appointments = await Appointment.findAll({
            where: { idCar: idCar },
        });

        if (appointments.length === 0) {
            return res.status(404).json({ message: "Pentru această mașina nu au fost realizate programari." });
        }


        const istorice = [];
        for (let appointment of appointments) {
            const istoric = await IstoricService.findOne({
                where: { idAppointment: appointment.idAppointment },
            });
            if (istoric) {
                istorice.push(istoric);
            }
        }

        res.status(200).json(istorice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Eroare la obținerea istoricului pentru mașină." });
    }
};


export const getIstoricByClient = async (req, res) => {
    const { idClient } = req.params;

    try {

        const client = await Client.findByPk(idClient);

        if (!client) {
            return res.status(404).json({ message: "Clientul nu a fost găsit." });
        }
        const cars = await Car.findAll({
            where: { idClient: idClient },
        });

        if (cars.length === 0) {
            return res.status(404).json({ message: "Clientul nu are mașini asociate." });
        }

        const istorice = [];
        for (let car of cars) {
            const appointments = await Appointment.findAll({
                where: { idCar: car.idCar },
            });

            if (appointments.length > 0) {
                for (let appointment of appointments) {
                    const istoric = await IstoricService.findOne({
                        where: { idAppointment: appointment.idAppointment },
                    });
                    if (istoric) {
                        istorice.push(istoric);
                    }
                }
            }
        }

        res.status(200).json(istorice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Eroare la obținerea istoricului pentru client." });
    }
}

//BONUS -- imi arata cat a incasat service ul in urma programrilor in ultimele 7 zile
export const getTotalCost = async (req, res) => {
    try {
        
        const date7DaysAgo = new Date();
        date7DaysAgo.setDate(date7DaysAgo.getDate() - 7);
        
        const istorice = await IstoricService.findAll({
            where: {
                dataFinalizare: {
                    [Op.gte]: date7DaysAgo, 
                },
                status: "Reparat" 
            }
        });

        if (istorice.length === 0) {
            return res.status(404).json({ message: "Nu a fost înregistrata nicio programare în istoric" });
        }

        let totalCost = 0;
        istorice.forEach(istoric => {
            totalCost += istoric.pretFinal || 0; 
        });

        return res.status(200).json({
            totalCost,
            message: "Sumă totală pentru ultimele 7 zile.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Eroare la calcularea costului total pentru service." });
    }
};
