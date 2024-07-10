var express = require("express");
var router = express.Router();

// esta funcion se piede usar como base para nueva funciones
router.get("/api/funcion-prueba", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Hola Mundo"
    });
});

module.exports = router;
