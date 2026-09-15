const express = require("express");
const router = express.Router();
const getHomeView = require("../views/homeView");
const getEvidenceView = require("../views/evidenceView");

router.get("/", (req, res) => res.send(getHomeView()));

router.get("/evidence/cicd", (req, res) => res.send(getEvidenceView("cicd")));
router.get("/evidence/workers", (req, res) => res.send(getEvidenceView("workers")));
router.get("/evidence/security", (req, res) => res.send(getEvidenceView("security")));

module.exports = router;