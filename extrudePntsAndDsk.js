const cv = require('opencv4nodejs');
const path = require('path');
const pictureData = require('./models/pic_data');
const directoryPath = path.join(__dirname, '/uploads/images/');

module.exports = function getData(imagename){
let orbDetector = new cv.ORBDetector();
let picture = new cv.imread(directoryPath+imagename);
let keypoints = orbDetector.detect(picture);
let descriptors = orbDetector.compute(picture, keypoints);
let newPic = new pictureData();
newPic.name = imagename;
newPic.keypoints = keypoints;
newPic.descriptors = descriptors;
newPic.save();
}
