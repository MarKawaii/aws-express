var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");

router.post("/api/compensaciones/cargar-compensaciones", async (req, res) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    try {
        const { id_sap, compensaciones } = req.body;  // Usar req.body en lugar de event.body
        const idSapString = id_sap.toString();

        const camposPermitidos = [
            "id", "ANTIG_CARG", "ANTIG_COMP", "ASIG_ESPEC", "ASIG_LOCAL", "ASIG_MOVIL", "ASIG_ZONA", "B_VACAC",
            "COLACION", "DISCAPACIDAD", "fecha_carga", "FEC_AUMENT", "GRADO", "GRATIFICAC", "MOTIVO",
            "M_INTERN", "M_PC01", "M_PC25", "M_PC50", "M_PC75", "M_PC90", "PERCENTIL", "PERIODO", "PORC_AUMEN",
            "RECONC", "RENT_B_MEN", "RTA_PROMED", "RTA_TOTAL", "R_FIJ_GAR", "SB", "SOCIEDAD", "TIPO_CONTRATO"
        ];

        const filtrarCampos = (compensacion) => {
            return Object.keys(compensacion)
                .filter(key => camposPermitidos.includes(key))
                .reduce((obj, key) => {
                    obj[key] = compensacion[key];
                    return obj;
                }, {});
        };

        const compensacionesFiltradas = {};
        const newCompIds = new Set();  // Set para manejar los IDs en la carga actual
        for (const [year, comps] of Object.entries(compensaciones)) {
            compensacionesFiltradas[year] = comps.map(filtrarCampos).filter(comp => {
                if (newCompIds.has(comp.id)) {
                    console.log(`ID duplicado en la carga actual encontrado y omitido: ${comp.id}`);
                    return false;  // Omitir si ya está en el set
                }
                newCompIds.add(comp.id);
                return true;  // Agregar si no está duplicado
            });
        }

        const result = await dynamodb.get({
            TableName: "CompensacionesTableNew",
            Key: {
                id_sap: idSapString
            }
        }).promise();

        let item;
        const createdAt = new Date().toISOString();

        if (result.Item) {
            item = result.Item;
            const existingIds = new Set();
            for (const year of Object.keys(item)) {
                if (year !== 'id_sap' && year !== 'createdAt' && year !== 'updatedAt') {
                    item[year].forEach(comp => existingIds.add(comp.id));
                }
            }

            let updates = false;
            for (const [year, comps] of Object.entries(compensacionesFiltradas)) {
                const filteredComps = comps.filter(comp => !existingIds.has(comp.id));
                if (filteredComps.length > 0) {
                    updates = true;
                    if (!item.hasOwnProperty(year)) {
                        item[year] = [];
                    }
                    item[year].push(...filteredComps);
                    filteredComps.forEach(comp => existingIds.add(comp.id));
                }
            }

            if (updates) {
                item.updatedAt = createdAt;
                await dynamodb.put({
                    TableName: "CompensacionesTableNew",
                    Item: item
                }).promise();

                res.json({ message: "Compensaciones actualizadas exitosamente" });
            } else {
                res.status(400).json({ message: "No se realizaron cambios; todos los IDs de las compensaciones ya existían" });
            }
        } else {
            item = {
                id_sap: idSapString,
                createdAt: createdAt,
                ...compensacionesFiltradas
            };

            await dynamodb.put({
                TableName: "CompensacionesTableNew",
                Item: item
            }).promise();

            res.json({ message: "Nuevo registro de compensaciones creado exitosamente" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

module.exports = router;
