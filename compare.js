const cv = require('opencv4nodejs');


module.exports = function getBestResult(input, data){
let bestResult = {
  id: "none",
  template:0,
  full: 0,
  keypoints: 0,
  keypoints2: 0,
  goodPoints: 0,
  score: 0
};
let orbDetector = new cv.ORBDetector();
data.forEach(it => {

let template = new cv.imread('./img/'+input);
let full = new cv.imread('./img/'+it);
let keypoints = orbDetector.detect(template);
let descriptors = orbDetector.compute(template, keypoints);

let keypoints2 = orbDetector.detect(full);
let descriptors2 = orbDetector.compute(full, keypoints2);

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
  bestResult.id = it;
  bestResult.score = percentage_similarity;
  bestResult.template = template;
  bestResult.full = full;
  bestResult.keypoints = keypoints,
  bestResult.keypoints2 = keypoints2,
  bestResult.goodPoints = goodPoints
}

});
let draw = cv.drawMatches(
  bestResult.template,
  bestResult.full,
  bestResult.keypoints,
  bestResult.keypoints2,
  bestResult.goodPoints
);
console.log("Best score is: " +bestResult.score);
console.log("Name: " +bestResult.id);
cv.imshowWait('SIFT matches', draw);
//cv.imwrite('./img/ttttttttt.jpg', draw)
}
