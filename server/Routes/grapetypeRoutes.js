const express = require('express');
const { getGrapeTypes } = require('../controller/grapetypeController');

const router = express.Router();

router.get('/', getGrapeTypes);

module.exports = router;
