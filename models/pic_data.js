const mongoose = require('mongoose');
const cv = require('opencv4nodejs');

var PicSchema = new mongoose.Schema({
    name: {
        type: String,
        //unique: true,
        required: true
    },
    keypoints: {
         type: mongoose.Schema.Types.Mixed
    },
    descriptors: {
        type: mongoose.Schema.Types.Mixed
    },
    encoded: {
        type: String
    }

});
module.exports = mongoose.model('images_data', PicSchema);
