import { Sequelize } from "sequelize";
import db from '../dbConfig.js';


const Appointment = db.define("Appointment", {
    idAppointment:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        allowNull: false
    },
    idCar: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    idClient: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    modalitateContact:{
        type: Sequelize.ENUM("email", "telefon", "in persoana"), 
        allowNull: false,
    },
    actiune:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    data:{
        type:Sequelize.DATE,
        allowNull:false

    },
    intervalTimp:{
        type: Sequelize.STRING,
        allowNull: false
    }
    
});

export default Appointment;