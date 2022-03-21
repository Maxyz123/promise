var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing' });
});

//Main Page
router.route('/mainPage')
    .get(function (req,res){
      res.render('mainPage',{title: "News Center"});
    });

//New Report
router.route('/newReport')
    .get(function (req,res){
      res.render('newReport',{title: "News Upload"});
    })

module.exports = router;
