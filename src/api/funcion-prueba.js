var express = require("express");
var router = express.Router();

router.get("/api/funcion-prueba", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Hola Mundo"
    });
});

module.exports = router;
