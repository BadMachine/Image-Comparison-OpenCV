const cv = require('opencv4nodejs');


const rows = 100; // height
const cols = 100; // width

// empty Mat
let template = new cv.imread('./img/test1.jpg');
let full = new cv.imread('./img/test2.jpg');
//console.log(full);
var orb =  new cv.ORBDetector(); //

//var kp = new cv.KeyPointVector();

var das=new cv.Mat();
//orb.detect(full, kp, das);


const matchFeatures = ({ template, full, detector, matchFunc }) => {
  // detect keypoints
  const keyPoints1 = detector.detect(template);
  const keyPoints2 = detector.detect(full);

  // compute feature descriptors
  const descriptors1 = detector.compute(template, keyPoints1);
  const descriptors2 = detector.compute(full, keyPoints2);

  // match the feature descriptors
  const matches = matchFunc(descriptors1, descriptors2);

  // only keep good matches
  const bestN = 40;
  const bestMatches = matches.sort(
    (match1, match2) => match1.distance - match2.distance
  ).slice(0, bestN);
console.log(bestMatches)
  return cv.drawMatches(
    template,
    full,
    keyPoints1,
    keyPoints2,
    bestMatches
  );
};


// check if opencv compiled with extra modules and nonfree

  const siftMatchesImg = matchFeatures({
    template,
  full,
    detector: new cv.SIFTDetector({ nFeatures: 2000 }),
    matchFunc: cv.matchFlannBased
  });
  cv.imshowWait('SIFT matches', siftMatchesImg);
