const mongoose = require('mongoose');

var PicSchema = new mongoose.Schema({
    name: {
        type: String,
        //unique: true,
        required: true
    },
    keypoints: {
         type: Array
    },
    descriptors: {
        type: mongoose.Schema.Types.Mixed
    }

});
module.exports = mongoose.model('pics_data', PicSchema);