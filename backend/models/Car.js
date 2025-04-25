import { Sequelize } from "sequelize";
import db from '../dbConfig.js';


const Car = db.define("Car", {
    idCar: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    idClient: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    serie: {
        type: Sequelize.STRING,
        allowNull:false
    },
    marca:{
        type:Sequelize.STRING,
        allowNull:false
    },
   model:{
        type:Sequelize.STRING,
        allowNull:false
    },
    anFabricatie: {
        type:Sequelize.INTEGER,
        allowNull:false,
        
    },
    tipMotor: {
        type: Sequelize.ENUM("diesel", "benzina", "hibrid", "electric"), 
        allowNull: false
    },
    capacitateMotor :{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    caiPutere: {
        type:Sequelize.INTEGER,
        allowNull:false
    },
    kwPutere: {
        type: Sequelize.VIRTUAL,  
        get() {
            return this.caiPutere * 0.735; 
        }
    }
});

export default Car;