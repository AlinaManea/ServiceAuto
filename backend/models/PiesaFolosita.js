import { Sequelize } from "sequelize";
import db from '../dbConfig.js';

const UsedPart = db.define("UsedPart", {
    id_: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    idPart: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    idIstoric: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
  
    cantitate: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
            min: 0,
        },
    },
    
    pretTotal:{
    type: Sequelize.FLOAT,
    allowNull: true
    }

});

export default UsedPart