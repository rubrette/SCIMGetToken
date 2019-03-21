var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/code', function(req, res, next) {
  res.render('auth', { title: 'SCIM token' });
});

module.exports = router;
