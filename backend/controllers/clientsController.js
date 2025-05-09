import Client from "../models/Client.js";
import Car from "../models/Car.js";
import Appointment from "../models/Appointment.js";
import validator from 'validator';

import { Sequelize } from 'sequelize';


// POST: adaugarea unui client
export const addClient = async (req, res) => {
  try {
    const { nume, telefon, email } = req.body;


    if (!nume || !email || !telefon) {
      return res.status(400).json({ success: false, message: "Nu aveți toate câmpurile completate!" });
    }

    if (nume.length < 7) {
      return res.status(400).json({ message: 'Numele si prenumele clientului trebuie să aibă cel puțin 7 caractere.' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Introduceți o adresă de email validă!" });
    }

    const existingUser = await Client.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "Există deja un client asociat acestei adrese de email!" });
    }

    if (!validator.isMobilePhone(telefon, 'ro-RO')) {
      return res.status(400).json({ success: false, message: "Introduceți un număr de telefon valid!" });
    }
    const client = await Client.create({
      nume,
      telefon,
      email
    });
    res.status(201).json({ message: 'Client adăugat cu succes!', client });
  } catch (error) {

    res.status(500).json({ message: 'Eroare la adăugarea clientului.', error: error.message });
  }
};

// toti clientii

export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea clienților.', error: error.message });
  }
};

// get by id client
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Clientul nu a fost găsit.' });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la căutarea clientului.', error: error.message });
  }
};

//get by status
export const getClientsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!['activ', 'inactiv'].includes(status.toLowerCase())) {
      return res.status(400).json({ message: 'Status invalid. Statusul trebuie să fie "activ" sau "inactiv".' });
    }

    const clients = await Client.findAll({ where: { status: status.toLowerCase() } });

    if (!clients.length) {
      return res.status(404).json({ message: `Nu există clienți cu statusul "${status}".` });
    }

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Eroare la obținerea clienților după status.', error: error.message });
  }
};


// PUT: actualizarea unui client
export const updateClient = async (req, res) => {
  const { id } = req.params;
  const { nume, telefon, email } = req.body;

  try {

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: 'Clientul nu a fost găsit.' });
    }

    client.nume = nume || client.nume;
    client.telefon = telefon || client.telefon;
    client.email = email || client.email;

    await client.save();
    res.status(200).json({ message: 'Client actualizat cu succes!', client });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la actualizarea clientului.', error: error.message });
  }
};

// DELETE: ștergerea unui client
export const deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: 'Clientul nu a fost găsit.' });
    }

    // Ștergem clientul din baza de date
    await client.destroy();

    res.status(200).json({ message: 'Client șters cu succes!' });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la ștergerea clientului.', error: error.message });
  }
};

// PATCH: inactivarea unui client
export const deactivateClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: 'Clientul nu a fost găsit.' });
    }
    client.status = 'inactiv';

    await client.save();

    res.status(200).json({ message: 'Client inactivat cu succes!', client });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la inactivarea clientului.', error: error.message });
  }
};


// PATCH: reactivarea unui client
export const reactivateClient = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: 'Clientul nu a fost găsit.' });
    }
    client.status = 'activ';

    await client.save();

    res.status(200).json({ message: 'Client reactivat cu succes!', client });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la reactivarea clientului.', error: error.message });
  }
};

// PT MASINII

//POST -  adaugarea unei masini
export const addCar = async (req, res) => {
  try {
    const { idClient } = req.params;
    const { serie, marca, model, anFabricatie, tipMotor, capacitateMotor, caiPutere } = req.body;

    if (!serie || !marca || !model || !anFabricatie || !tipMotor || !capacitateMotor || !caiPutere) {
      return res.status(400).json({ message: 'Toate câmpurile sunt obligatorii.' });
    }

    //teoretic VIN ul unei masini e de 17 caractere dar am facut validarea cu 6 sa mi fie mai usor la testare
    if ( serie.length !== 6) {
      return res.status(400).json({ message: 'Seria unei masini trebuie sa fie de exact 17 caractere.' });
    }

    const currentYear = new Date().getFullYear();
    if (isNaN(anFabricatie) || anFabricatie < 1900 || anFabricatie > currentYear) {
      return res.status(400).json({ message: 'Eroare! Anul fabricației trebuie să fie între 1900 și anul curent.' });
    }

    if (isNaN(capacitateMotor) || capacitateMotor <= 0 || capacitateMotor > 8) {
      return res.status(400).json({ message: 'Capacitatea motorului nu are cum sa fie un numar negativ sau nerealist de mare' });
    }

    if (isNaN(caiPutere) || caiPutere < 20 || caiPutere > 2000) {
      return res.status(400).json({ message: 'Numărul de cai putere trebuie să fie între 20 și 2000.' });
    }

    const tipuriMotorPermise = ['benzina', 'diesel', 'electric', 'hibrid'];
    if (!tipuriMotorPermise.includes(tipMotor.toLowerCase())) {
      return res.status(400).json({ message: `Tipul de motor trebuie să fie unul dintre: ${tipuriMotorPermise.join(', ')}` });
    }


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

export const getCarsByClient = async (req, res) => {
  try {
    const { idClient } = req.params;
    const cars = await Car.findAll({ where: { idClient } });

    if (!cars.length) {
      return res.status(404).json({ message: 'Nu există mașini pentru acest client.' });
    }

    return res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Eroare la obținerea mașinilor.', error: error.message });
  }
};


//   export const getAllCarsInService = async (req, res) => {
//     try {

//       const appointments = await Appointment.findAll({
//         where: { status: 'în service' },
//         include: {
//           model: Car,
//           as: 'car',
//         },
//       });

//       const carsInService = appointments.map(appointment => appointment.car);

//       if (!carsInService.length) {
//         return res.status(404).json({ message: 'Nu sunt mașini în service în acest moment.' });
//       }

//       return res.status(200).json(carsInService);
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: 'Eroare la obținerea mașinilor în service.', error: error.message });
//     }
//   };


export const deleteCar = async (req, res) => {
  try {
    const { idCar } = req.params;


    const car = await Car.findByPk(idCar);

    if (!car) {
      return res.status(404).json({ message: 'Mașina nu a fost găsită.' });
    }

    const hasAppointments = await Appointment.findOne({ where: { idCar } });

    if (hasAppointments) {
      return res.status(400).json({ message: 'Nu se poate șterge mașina deoarece are programări în service.' });
    }
    await car.destroy();

    return res.status(200).json({ message: 'Mașina selectata a fost stearsa!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Eroare la stergere!', error: error.message });
  }
};

//modif

export const updateCar = async (req, res) => {
  try {
    const { idCar } = req.params;
    const { serie, marca, model, anFabricatie, tipMotor, capacitateMotor, caiPutere } = req.body;

    const car = await Car.findByPk(idCar);

    if (!car) {
      return res.status(404).json({ message: 'Masina nu a fost gasita.' });
    }

    // VALIDARI
    if (serie && serie.length !== 6) {
      return res.status(400).json({ message: 'Seria unei masini trebuie sa fie de exact 6 caractere.' });
    }

    const currentYear = new Date().getFullYear();
    if (anFabricatie && (isNaN(anFabricatie) || anFabricatie < 1900 || anFabricatie > currentYear)) {
      return res.status(400).json({ message: 'Anul fabricației trebuie să fie între 1900 și anul curent.' });
    }

    if (capacitateMotor && (isNaN(capacitateMotor) || capacitateMotor <= 0 || capacitateMotor > 8)) {
      return res.status(400).json({ message: 'Capacitatea motorului nu poate fi negativă sau nerealist de mare.' });
    }

    if (caiPutere && (isNaN(caiPutere) || caiPutere < 20 || caiPutere > 2000)) {
      return res.status(400).json({ message: 'Numărul CP trebuie să fie intre 20 și 2000.' });
    }

    const tipuriMotorPermise = ['benzina', 'diesel', 'electric', 'hibrid'];
    if (tipMotor && !tipuriMotorPermise.includes(tipMotor.toLowerCase())) {
      return res.status(400).json({ message: `Tipul de motor trebuie să fie unul dintre: ${tipuriMotorPermise.join(', ')}` });
    }

    
    car.serie = serie || car.serie;
    car.marca = marca || car.marca;
    car.model = model || car.model;
    car.anFabricatie = anFabricatie || car.anFabricatie;
    car.tipMotor = tipMotor || car.tipMotor;
    car.capacitateMotor = capacitateMotor || car.capacitateMotor;
    car.caiPutere = caiPutere || car.caiPutere;

    await car.save();

    return res.status(200).json({ message: 'Caracteristicile masinii au fost actualizate', car });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Eroare la actualizare!', error: error.message });
  }
};


//cautare masina
export const searchCars = async (req, res) => {
  try {
      console.log("searchCars function called with query:", req.query);
    const { marca, tipMotor, anFabricatie } = req.query;

    const cars = await Car.findAll({
      where: {
        ...(marca && { marca }),
        ...(tipMotor && { tipMotor }),
        ...(anFabricatie && { anFabricatie })
      }
    });

    if (!cars.length) {
      return res.status(404).json({ message: 'Nu au fost găsite mașini cu aceste criterii.' });
    }

    return res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Eroare la căutarea mașinilor.', error: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const { idCar } = req.params;

    const car = await Car.findOne({
      where: {
        idCar: idCar
      }
    });

    if (!car) {
      return res.status(404).json({ message: `Mașina cu id-ul ${idCar} nu a fost găsită.` });
    }

    return res.status(200).json(car);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Eroare la obținerea detaliilor mașinii.', error: error.message });
  }
};

//filtrare dupa an fabricatie
export const filterCarsByYear = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;

    const cars = await Car.findAll({
      where: {
        anFabricatie: {
          [Sequelize.Op.between]: [startYear, endYear]
        }
      }
    });

    if (!cars.length) {
      return res.status(404).json({ message: 'Nu au fost găsite mașini în acest interval de timp.' });
    }

    return res.status(200).json(cars);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Eroare la filtrarea mașinilor.', error: error.message });
  }
};
