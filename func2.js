const cv = require('opencv4nodejs');
const path = require('path');
const fs = require('fs');



let imagesToCompare = [];
const directoryPath = path.join(__dirname, 'img');
// let imagesToCompare = [];
// fs.readdir(directoryPath, function (err, files) {
//     //handling error
//     if (err) {
//         return console.log('Unable to scan directory: ' + err);
//     }
//     //listing all files using forEach
//     files.forEach(function (file) {
//         // Do whatever you want to do with the file
//         imagesToCompare.push(file);
//         console.log(file);
//     });
// });
imagesToCompare = fs.readdirSync(directoryPath);
// empty Mat
let template = new cv.imread('./img/GoldenGateBridge-001.jpg');
let full = new cv.imread('./img/full.jpg');









let orbDetector = new cv.ORBDetector();
let keypoints = orbDetector.detect(template);
let descriptors = orbDetector.compute(template, keypoints);

let keypoints2 = orbDetector.detect(full);
let descriptors2 = orbDetector.compute(full, keypoints2);

let matches = cv.matchKnnBruteForceHamming(descriptors, descriptors2, 2);
let goodPoints = [];
matches.forEach(element =>{
  console.log(element);
if(element[0].distance <  0.8 * (element[1].distance)) {
    console.log("ELEM 1 DIST: " + (element[0].distance))
  console.log("ELEM 2 DIST: " + (element[1].distance))
goodPoints.push(element[0]);
}
});
console.log("Total matches: " + matches.length);
console.log("good " +goodPoints.length);

let number_keypoints = 0;
if (keypoints.length >= keypoints2.length){
        number_keypoints = keypoints.length;
    } else{
        number_keypoints = keypoints2.length;
      }

let percentage_similarity = goodPoints.length / number_keypoints * 100;
console.log(percentage_similarity);
let draw = cv.drawMatches(
  template,
  full,
  keypoints,
  keypoints2,
  goodPoints
);
console.log(imagesToCompare);
cv.imshowWait('SIFT matches', draw);
cv.imwrite('./img/ttttttttt.jpg', draw)
