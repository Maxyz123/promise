let Story = require('../models/stories');

exports.insert = function (req, res) {
    let userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }

    let story = new Story({
        author_name: userData.name,
        report_title: userData.title,
        report_text: userData.text,
        image_url: userData.image_url
    });
    console.log('received: ' + story);

    story.save()
        .then ((results) => {
            console.log(results._id);
            res.json(story);
        })
        .catch ((error) => {
            res.status(500).json('Could not insert - probably incorrect data! ' + JSON.stringify(error));
        })
}

exports.getData = function (req, res){
    let userData = req.body;
    if (userData == null)
        res.status(403).json('No data sent!')

    Story.find({},
        'author_name report_title report_text image_url date')
        .then(stories =>{
            res.json(stories);
        })
        .catch((err) => {
            res.status(500).send('Invalid data or not found!' + JSON.stringify(err));
        });

}