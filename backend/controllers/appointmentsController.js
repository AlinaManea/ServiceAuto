import Client from "../models/Client.js";
import Car from "../models/Car.js";
import Appointment from "../models/Appointment.js";
import { Sequelize } from "sequelize";
import { Op } from "sequelize";



export const createAppointment = async (req, res) => {
  try {
    const { idCar, idClient, modalitateContact, actiune, data, intervalTimp } = req.body;
    
    // Validare oră
    const timeRegex = /^([8-9]|1[0-7]):([0-5][0-9])$/;
    if (!intervalTimp.match(timeRegex)) {
      return res.status(400).json({
        message: "Intervalul trebuie să fie între 08:00 și 17:00 și în multiplu de 30 minute."
      });
    }
    
    const [hours, minutes] = intervalTimp.split(':').map(Number);
    if (minutes % 30 !== 0 || hours < 8 || (hours === 17 && minutes > 0)) {
      return res.status(400).json({
        message: "Programările sunt permise doar între 08:00 și 17:00 în intervale de 30 minute."
      });
    }
    
    // Validare dată sa nu fie din trecut
    const today = new Date();
    const selectedDate = new Date(data);
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({
        message: "Nu poți seta o programare în trecut."
      });
    }
    
    // daca apartine clientului masina!!!!
    const car = await Car.findByPk(idCar);
    if (!car) {
      return res.status(404).json({ message: "Mașina nu există." });
    }
    
    if (car.idClient !== idClient) {
      return res.status(403).json({
        message: "Această mașină nu aparține clientului specificat."
      });
    }
    
   
   // daca exista deja la data si ora respectova programare
    const existingCarAppointment = await Appointment.findOne({
      where: {
        idCar,
        data,
        intervalTimp
      }
    });
    
    if (existingCarAppointment) {
      return res.status(409).json({
        message: "Există deja o programare pentru această mașină la aceeași dată și oră."
      });
    }
    
    // 2. 
    const existingTimeSlotAppointment = await Appointment.findOne({
      where: {
        data,
        intervalTimp
      }
    });
    
    if (existingTimeSlotAppointment) {
      return res.status(409).json({
        message: "Intervalul orar selectat este deja ocupat. Alege alt interval."
      });
    }
  
    const appointment = await Appointment.create({
      idCar,
      idClient,
      modalitateContact,
      actiune,
      data,
      intervalTimp
    });
    
    return res.status(201).json({
      message: "O noua programare a fost realizat!!",
      appointment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Nu s a putut realiza programarea",
      error: error.message
    });
  }
};

  //
  export const getAppointmentsByClient = async (req, res) => {
    try {
      const { idClient } = req.params;
  
      const appointments = await Appointment.findAll({
        where: {
          idClient
        }
      });
  
      if (!appointments.length) {
        return res.status(404).json({
          message: "Nu exista programari pentru acest client."
        });
      }
  
      return res.status(200).json(appointments);
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "A aparut o eroare la obtinerea programarilor.",
        error: error.message
      });
    }
  };

  //
  

  export const getAppointmentsByCar = async (req, res) => {
    try {
      const { idCar } = req.params;
  
      const appointments = await Appointment.findAll({
        where: {
          idCar
        }
      });
  
      if (!appointments.length) {
        return res.status(404).json({
          message: "Nu sunt programari pentru aceasta masina."
        });
      }
  
      return res.status(200).json(appointments);
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "A aparut o eroare la obtinerea programarilor pentru masina.",
        error: error.message
      });
    }
  };


  export const updateAppointment = async (req, res) => {
  try {
    const { idAppointment } = req.params;
    const { modalitateContact, actiune, data, intervalTimp } = req.body;

    const appointment = await Appointment.findByPk(idAppointment);

    if (!appointment) {
      return res.status(404).json({
        message: "Programarea nu a fost gasita."
      });
    }

    const timeRegex = /^([8-9]|1[0-7]):([0-5][0-9])$/;
    if (!intervalTimp.match(timeRegex)) {
      return res.status(400).json({
        message: "Intervalul trebuie sa fie intre 08:00 si 17:00 si sa fie in multiplu de 30 de minute."
      });
    }

    const [hours, minutes] = intervalTimp.split(':').map(Number);

    if (minutes % 30 !== 0) {
      return res.status(400).json({
        message: "Minutele trebuie sa fie un multiplu de 30 (de exemplu, 08:00, 08:30)."
      });
    }

    if (hours < 8 || hours > 17 || (hours === 17 && minutes > 0)) {
      return res.status(400).json({
        message: "Programarile sunt permise doar intre 08:00 si 17:00."
      });
    }

   
    const normalizeDate = (dateStr) => {
      const d = new Date(dateStr);
      d.setHours(0, 0, 0, 0);
      return d;
    };
    const padTime = (str) => {
      const [h, m] = str.split(':').map(Number);
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const normalizedDate = normalizeDate(data);
    const normalizedTime = padTime(intervalTimp);
    const conflictingAppointment = await Appointment.findOne({
      where: {
        data: normalizedDate,
        intervalTimp: normalizedTime,
        idAppointment: { [Op.ne]: idAppointment } 
      }
    });

    if (conflictingAppointment) {
      return res.status(409).json({
        message: "Exista deja o programare in acest interval orar."
      });
    }

    await appointment.update({
      modalitateContact,
      actiune,
      data: normalizedDate,
      intervalTimp: normalizedTime
    });

    return res.status(200).json({
      message: "Programarea a fost actualizata.",
      appointment
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "A aparut o eroare la actualizarea programarii.",
      error: error.message
    });
  }
};

  
  //stergere
  export const deleteAppointment = async (req, res) => {
    try {
      const { idAppointment } = req.params;
  
      const appointment = await Appointment.findByPk(idAppointment);
  
      if (!appointment) {
        return res.status(404).json({
          message: "Programarea nu a fost gasita."
        });
      }
  
      await appointment.destroy();
  
      return res.status(200).json({
        message: "Programarea a fost stearsa."
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "A aparut o eroare la stergerea programarii.",
        error: error.message
      });
    }
  };

  //obtinerea programarilor dintr-un anumit interval de timp

  export const getAppointmentsInterval = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      const appointments = await Appointment.findAll({
        where: {
          data: {
            [Sequelize.Op.between]: [startDate, endDate]
          }
        }
      });
  
      if (!appointments.length) {
        return res.status(404).json({
          message: "Nu exista programari in acest interval de timp."
        });
      }
  
      return res.status(200).json(appointments);
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "A aparut o eroare la obtinerea programarilor.",
        error: error.message
      });
    }
  };
  
  