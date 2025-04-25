import Client from "../models/Client.js";
import Car from "../models/Car.js";
import Appointment from "../models/Appointment.js";


export const createAppointment = async (req, res) => {
    try {
      const { idCar, idClient, modalitateContact, actiune, data, intervalTimp } = req.body;
  
      //VALIDARE pentru interval de timp la programare
      const timeRegex = /^([8-9]|1[0-7]):([0-5][0-9])$/;
      if (!intervalTimp.match(timeRegex)) {
        return res.status(400).json({
          message: "Intervalul trebuie să fie între 08:00 și 17:00 și să fie în multiplu de 30 de minute."
        });
      }
  
      const [hours, minutes] = intervalTimp.split(':').map(Number);
  
      if (minutes % 30 !== 0) {
        return res.status(400).json({
          message: "Minutele trebuie să fie un multiplu de 30 (de exemplu, 08:00, 08:30)."
        });
      }
  
      if (hours < 8 || hours > 17 || (hours === 17 && minutes > 0)) {
        return res.status(400).json({
          message: "Programările sunt permise doar între 08:00 și 17:00."
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
        message: "Programarea a fost creată cu succes.",
        appointment
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Eroare la realizarea programării",
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
  
  //actualizare
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
  
      await appointment.update({ modalitateContact, actiune, data, intervalTimp });
  
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
  
  