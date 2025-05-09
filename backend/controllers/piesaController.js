import  CarPart  from "../models/Piesa.js";  


// Creare piesă auto
export const createCarPart = async (req, res) => {
    try {
        const { denumire, marca, descriere, stoc, pretUnitar, activ } = req.body;

        const newPart = await CarPart.create({
            denumire,
            marca,
            descriere,
            stoc,
            pretUnitar,
            activ
        });

        return res.status(201).json({
            message: "Piesa auto a fost adaugată în inventarul service-ului!",
            part: newPart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Eroare la creare!",
            error: error.message
        });
    }
};

// 
export const getAllCarParts = async (req, res) => {
    try {
        const carParts = await CarPart.findAll();

        if (carParts.length === 0) {
            return res.status(404).json({
                message: "Nu au fost găsite piese auto"
            });
        }

        return res.status(200).json(carParts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Eroare la găsirea piesei",
            error: error.message
        });
    }
};

//
export const getCarPartById = async (req, res) => {
    try {
        const { idPart } = req.params;

        const carPart = await CarPart.findByPk(idPart);

        if (!carPart) {
            return res.status(404).json({
                message: "Piesa auto nu a fost găsită în cadrul service-ului!"
            });
        }

        return res.status(200).json(carPart);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Eroare la obținerea piesei auto",
            error: error.message
        });
    }
};

// modifică o piesă auto
export const updateCarPart = async (req, res) => {
    try {
        const { idPart } = req.params;
        const { denumire, marca, descriere, stoc, pretUnitar, activ } = req.body;

        const carPart = await CarPart.findByPk(idPart);

        if (!carPart) {
            return res.status(404).json({
                message: "Piesa auto nu a fost găsită"
            });
        }

        carPart.denumire = denumire || carPart.denumire;
        carPart.marca = marca || carPart.marca;
        carPart.descriere = descriere || carPart.descriere;
        carPart.stoc = stoc !== undefined ? stoc : carPart.stoc;
        carPart.pretUnitar = pretUnitar !== undefined ? pretUnitar : carPart.pretUnitar;
        carPart.activ = activ !== undefined ? activ : carPart.activ;

        await carPart.save();

        return res.status(200).json({
            message: "Piesa auto a fost actualizată cu succes!",
            part: carPart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Eroare la actualizarea piesei auto",
            error: error.message
        });
    }
};

// Șterge o piesă auto
export const deleteCarPart = async (req, res) => {
    try {
        const { idPart } = req.params;

        const carPart = await CarPart.findByPk(idPart);

        if (!carPart) {
            return res.status(404).json({
                message: "Piesa auto nu a fost găsită"
            });
        }

        await carPart.destroy();

        return res.status(200).json({
            message: "Piesa auto a fost ștearsă din cadrul service-ului!"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Eroare la ștergerea piesei auto",
            error: error.message
        });
    }
};

// Actualizează stocul unei piese auto
export const updateCarPartStock = async (req, res) => {
    try {
        const { idPart } = req.params;
        const { stoc } = req.body;

        if (stoc < 0) {
            return res.status(400).json({
                message: "Stocul nu poate fi negativ"
            });
        }

        const carPart = await CarPart.findByPk(idPart);

        if (!carPart) {
            return res.status(404).json({
                message: "Piesa auto nu a fost găsită"
            });
        }

        carPart.stoc = stoc;

        await carPart.save();

        return res.status(200).json({
            message: "Stocul piesei auto a fost actualizat cu succes!",
            part: carPart
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Eroare la actualizarea stocului piesei auto",
            error: error.message
        });
    }
};



// Dezactivează o piesă auto
export const disableCarPart = async (req, res) => {
    try {
        const { idPart } = req.params;

        const carPart = await CarPart.findByPk(idPart); 

        if (!carPart) {
            return res.status(404).json({
                message: "Piesa auto nu a fost găsită"
            });
        }

        if (carPart.activ === false) {
            return res.status(400).json({
                message: "Piesa auto este deja dezactivată"
            });
        }

     
        if (carPart.stoc === 0) {
            carPart.activ = false;
            await carPart.save();
            
            return res.status(200).json({
                message: "Piesa auto a fost dezactivată cu succes!",
                part: carPart
            });
        } else {
            return res.status(400).json({
                message: "Piesa auto nu poate fi dezactivată pentru că are stocul mai mare de 0"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Eroare la dezactivarea piesei auto",
            error: error.message
        });
    }
};

// Activează o piesă auto
export const enableCarPart = async (req, res) => {
    try {
        const { idPart } = req.params;

        const carPart = await CarPart.findByPk(idPart);  // Folosește findByPk

        if (!carPart) {
            return res.status(404).json({
                message: "Piesa auto nu a fost găsită"
            });
        }

        // Verificăm dacă piesa este deja activată
        if (carPart.activ === true) {
            return res.status(400).json({
                message: "Piesa auto este deja activată"
            });
        }

        // Dacă stocul este mai mare de 0, activăm piesa
        if (carPart.stoc > 0) {
            carPart.activ = true;  // Activează piesa
            await carPart.save();

            return res.status(200).json({
                message: "Piesa auto a fost activată cu succes!",
                part: carPart
            });
        } else {
            return res.status(400).json({
                message: "Piesa auto nu poate fi activată pentru că stocul este 0"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Eroare la activarea piesei auto",
            error: error.message
        });
    }
};
