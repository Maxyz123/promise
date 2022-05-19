var express = require('express');
var router = express.Router();

var story = require('../controllers/stories');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('mainPage', { title: 'News Center'});
});

router.route('/index')
    .get(function (req,res){
        res.render('index',{title: 'Image Browsing', NewsId:'', ReportText:''});
    })
    .post(function (req,res){
        console.log(req.body.ReportText);
        res.render('index',{title: 'Start your new Chat Room!', NewsId: req.body.NewsId, ReportText: req.body.ReportText});
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
