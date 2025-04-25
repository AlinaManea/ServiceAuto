import { Sequelize } from "sequelize";
import db from '../dbConfig.js';


const Client = db.define("Client", {
    idClient: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nume: {
        type: Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    telefon:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true
    }
},
{
    timestamps: true  
});

export default Client;