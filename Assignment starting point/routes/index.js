var express = require('express');
var router = express.Router();

var story = require('../controllers/stories');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Image Browsing', image: ''});
});

router.route('/index')
    .get(function (req,res){
        res.render('index',{title: 'Image Browsing', image: ''});
    })
    .post(function (req,res){
        res.render('index',{title: 'Start your new Chat Room!', image: req.body.imageUrl});
    });

//Main Page
router.route('/mainPage')
    .get(function (req,res){
      res.render('mainPage',{title: "News Center"});
    })
    .post(story.getData);


//New Report
router.route('/newReport')
    .get(function (req,res){
      res.render('newReport',{title: "News Upload"});
    })
    .post(story.insert);

module.exports = router;
