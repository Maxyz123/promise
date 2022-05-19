const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Story = new Schema(
    {
        author_name: {type: String, required: true, max: 100},
        report_title:{type: String, required: true, max: 100},
        report_text: {type: String, required: true},
        image_url: {type: String, required: true},
        date: {type: Date, default: Date.now()}
    }
);

Story.set('toObject', {getters: true, virtuals: true});

module.exports = mongoose.model('Story', Story);