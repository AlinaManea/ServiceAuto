import { Sequelize } from "sequelize";
import db from '../dbConfig.js';

const IstoricService = db.define("IstoricService", {
    idIstoric: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idAppointment: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM("In asteptare", "Primire", "În lucru", "Reparat"), 
        defaultValue: "In asteptare", 
        allowNull: false
    },
    probleme: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    tipServiciu: {
        type: Sequelize.ENUM("verificare", "revizie", "reparatie"), 
        allowNull: true
    },
    operatiuni:{
        type: Sequelize.TEXT, 
        allowNull: true

    },
    pieseSchimbate: {
        type: Sequelize.JSON, 
        allowNull: true
    },
    problemeIdentificate:{
        type: Sequelize.TEXT, 
        allowNull: true
    },
    reparat: {
        type: Sequelize.BOOLEAN, 
        allowNull: false,
        defaultValue: false
    },
    durataReparatie: {
        type: Sequelize.INTEGER,  // în minute
        allowNull: true,
        validate: {
            isMultipleOfTen(value) {
                if (value && value % 10 !== 0) {
                    throw new Error("Durata reparației trebuie să fie în multiplu de 10 minute.");
                }
            }
        }
    },
    dataFinalizare:{
        type:Sequelize.DATE,
        allowNull:true
    },
    pretFinal:{
        type:Sequelize.FLOAT,
        allowNull:true
    }
});

export default IstoricService