var express = require('express');
var router = express.Router();
var fs = require('fs');
// const wellingtonGeojson = require('../data/Wellington_21Q3_V0_AOI.geojson')

router.get('/:fileName', function(req, res, next) {
  const fileName = req.params.fileName ?? 'Wellington_21Q3_V0_AOI.geojson'
    res.setHeader('Content-Type', 'application/json');
    fs.createReadStream(`./data/${fileName}`).pipe(res);
});


module.exports = router;