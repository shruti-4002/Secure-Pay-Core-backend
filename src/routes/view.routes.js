const express = require("express");
const router = express.Router();
const getHomeView = require("../views/homeView");
const getEvidenceView = require("../views/evidenceView");

router.get("/", (req, res) => {
    res.send(getHomeView());
});

router.get("/evidence", (req, res) => {
    res.send(getEvidenceView());
});

module.exports = router;