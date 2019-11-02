const cv = require('opencv4nodejs');
const baseEnc = require('./base64enc.js');

module.exports = function getBestResult(inputData, DBdata){
let bestResult = {
  id: "none",
  template:0,
  full: 0,
  keypoints: 0,
  keypoints2: 0,
  goodPoints: 0,
  score: 0
};

let input64 = inputData.encoded;
//console.log(input64);
//console.log("...............................");

//let b = baseEnc.string64encode(JSON.stringify(inputData.keypoints));
//console.log(b);

 let inpBuf = Buffer.from(input64, 'base64');
 let descriptors = cv.imdecode(inpBuf);
let keypoints = inputData.keypoints;


let buffer;
DBdata.forEach(it => {

  let desc = it.encoded;
  buffer = Buffer.from(desc, 'base64');
  let out = cv.imdecode(buffer);


let keypoints2 = it.keypoints;
let descriptors2 = out;


let matches = cv.matchKnnBruteForceHamming(descriptors, descriptors2, 2);


let goodPoints = [];
matches.forEach(element =>{
if(element[0].distance <  0.8 * (element[1].distance)) {
goodPoints.push(element[0]);
}
});
let number_keypoints = 0;
if (keypoints.length >= keypoints2.length){
        number_keypoints = keypoints.length;
    } else{
        number_keypoints = keypoints2.length;
      }

let percentage_similarity = goodPoints.length / number_keypoints * 100;
if (percentage_similarity> bestResult.score) {
  bestResult.id = it.name;
  bestResult.score = percentage_similarity;
  bestResult.keypoints = keypoints,
  bestResult.keypoints2 = keypoints2,
  bestResult.goodPoints = goodPoints
}

});
console.log('./uploads/images/'+bestResult.id)
let bestImage = cv.imread('./uploads/images/'+bestResult.id);

return {
  image: cv.imencode('.jpg', bestImage).toString('base64'),
  percentage: bestResult.score
}
// let draw = cv.drawMatches(
//   bestResult.template,
//   bestResult.full,
//   bestResult.keypoints,
//   bestResult.keypoints2,
//   bestResult.goodPoints
// );
console.log("Best score is: " +bestResult.score);
console.log("Name: " +bestResult.id);
//cv.imshowWait('SIFT matches', draw);
//cv.imwrite('./img/ttttttttt.jpg', draw)
}
