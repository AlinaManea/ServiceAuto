import { Sequelize } from "sequelize";
import db from '../dbConfig.js';

const CarPart = db.define("CarPart", {
    idPart: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    denumire: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    marca: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    descriere: {
        type: Sequelize.TEXT,
        allowNull: true,
    },

    stoc: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },

    pretUnitar: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
        },
    },

    activ: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
});

export default CarPart