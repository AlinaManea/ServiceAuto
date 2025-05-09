import mysql from "mysql2/promise";
import env from "dotenv";
import Client  from './Client.js';
import Car from './Car.js'
import Appointment from "./Appointment.js";
import IstoricService from "./IstoricService.js";
import CarPart from "./Piesa.js";
import UsedPart from "./PiesaFolosita.js";
import db from '../dbConfig.js'

env.config();

async function createDB() {
    let conn;
    try {
       
        conn = await mysql.createConnection({
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
        });
        
        await conn.query('CREATE DATABASE IF NOT EXISTS ServiceAuto');
    } catch (err) {
        console.error("Eroare la crearea bazei de date:", err);
    } finally {
        if (conn) {
            await conn.end();
        }
    }
}

//relatiile intre tabele
 function fkConfig() {
    // relatia 1-N intre client si masina
    Client.hasMany(Car, {as:"Cars", foreignKey: "idClient"});
    Car.belongsTo(Client,{ foreignKey: "idClient" });

    //relatia 1-N intre masina si programari
    Car.hasMany(Appointment, { foreignKey: "idCar" });
    Appointment.belongsTo(Car, { foreignKey: "idCar" });

    // Relația 1-N între client și programari
Client.hasMany(Appointment, { foreignKey: "idClient" });
Appointment.belongsTo(Client, { foreignKey: "idClient" });

    // relatia 1-1 între programare și istoric
Appointment.hasOne(IstoricService, { foreignKey: "idAppointment" });
IstoricService.belongsTo(Appointment, { foreignKey: "idAppointment" });

    //PiesaFolosita = tabela de legatura
    // relatia M-M intre istoric si piese
   
  
    //   CarPart.hasMany(UsedPart, { foreignKey: "idPart" });
    //   UsedPart.belongsTo(CarPart, { foreignKey: "idPart" });
     //   IstoricService.hasMany(UsedPart, { foreignKey: "idIstoric" });
    //   UsedPart.belongsTo(IstoricService, { foreignKey: "idIstoric" });

    CarPart.belongsToMany(IstoricService, {
        through: UsedPart,
        as: "Reparatii",
        foreignKey: "idPart"
    });
    
    IstoricService.belongsToMany(CarPart, {
        through: UsedPart,
        as: "PieseFolosite",
        foreignKey: "idIstoric"
    });


}
async function syncModels() {
    try {
        await db.sync({alter: true });; 
      
    } catch (error) {
        console.error('Eroare la sincronizarea modelelor:', error);
    }
}
async function dbInit()
{
   await createDB();
   fkConfig();
   await syncModels();
   
}
export default dbInit;