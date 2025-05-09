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
        allowNull:false
    },
    telefon:{
        type:Sequelize.STRING,
        allowNull:false,
        unique: true
    },
    status: {  
        type: Sequelize.ENUM("activ", "inactiv"),
        defaultValue: 'activ'
    }
},
{
    timestamps: true  
});

export default Client;