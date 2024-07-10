var express = require("express");
var router = express.Router();

router.post("/api/compensaciones/nueva-compensacion", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Hola esta es la nueva compensacion"
    });
});

module.exports = router;
