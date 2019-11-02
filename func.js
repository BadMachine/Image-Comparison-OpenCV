const cv = require('opencv4nodejs'); // OpenCV for NodeJS
const comp = require('./compare.js'); //user function for comparing pictures with keypoint data and descriptors
const baseEnc = require('./base64enc.js');
const compTest = require('./compareTest.js'); //user function for comparing pictures with keypoint data and descriptors
const path = require('path'); //
const fs = require('fs'); //compare
const mongoose = require('mongoose'); //mongoose client
const Mconf = require('./config/mongooseConfig'); // mongoose client settings
const bodyParser = require('body-parser'); // needs to easy get data prom POST
const express = require('express'); // Express Framework
const pictureData = require('./models/pic_data');  // Mongoose Schema for pics data
const writeNewImage = require('./extrudePntsAndDsk.js'); // function for extruding keypoints and descriptors
var app = require('express')();                      // init server with Express
var server = require('http').Server(app);          // init Http server
var io = require('socket.io')(server);   //init server with Socket
const multer = require('multer');
let dataArr = [];                     // data from DB
const Storage = multer.diskStorage({
     destination: function(req, file, callback) {
         callback(null, "./uploads/images");
     },
     filename: function(req, file, callback) {
         callback(null, file.originalname);
     }
 });

const upload = multer({
      storage: Storage
  }).array("photos", 50); //Field name and max count


const uri = "mongodb+srv://Sylar:BreakingBad1@cluster0-meybi.mongodb.net/pictures?retryWrites=true&w=majority";  //connecting to db, grabbing data from collection
const db = mongoose.connect(uri,Mconf, (err,db)=>{
    if (err) return console.log(err);
  pictureData.find()
         .then(obj => {
             for (var i = 0; i <obj.length; i++) {
                 dataArr.push(obj[i]);
             }
             console.log("Data grabbed from db");
         })
         .catch(error => {
             console.log(error);
         })
    console.log('Connected to DB');


});

app.use (bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(express.static(path.join(__dirname, 'main')));
    app.set('view engine','ejs');






const directoryPath = path.join(__dirname, 'img');

server.listen(80, ()=>{
console.log("socket listening port 80")
});


app.get('/', function (req, res) {
  res.render('index');
});

app.get('/upload',(req,res)=>{
    res.render('register');
});

app.post('/upload', (req, res, next) => {
  upload(req, res, function(err) {
    let filesToProcess = req.files;

    filesToProcess.forEach(picture =>{
      writeNewImage(picture.originalname);
      console.log(picture.originalname + " uploaded!");
    });
          if (err) {
              return res.end("Something went wrong! " + err);
          }
          return res.end("File uploaded sucessfully!.");

      });

});








io.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
console.log("started");
  socket.on('send', function (data) {
let stringdata = data.split('...');
let dataSet = {
encoded:     stringdata[0],
keypoints:   JSON.parse(Buffer.from(stringdata[1], 'base64').toString('ascii'))
};
let a = compTest(dataSet, dataArr);
console.log(a);
io.emit('result', {result: a});
    //console.log(data);
  });

});



// setTimeout(()=>{
//   pictureData.find({name: "home.jpg"})
//          .then(obj => {
//
//           console.log(obj[0].descriptors);
//           console.log(dataArr.length);
//           let a = compTest(obj[0], dataArr);
//         //  console.log(a);
//
//          })
//          .catch(error => {
//              console.log(error);
//          })
//
//
// }, 3000);


//let result = compTest('../main/pyr6.jpg', imagesToCompare);







// let imagesToCompare = [];
// imagesToCompare = fs.readdirSync(directoryPath);
// console.log(imagesToCompare)
//
// let result = comp('../main/pyr6.jpg', imagesToCompare);
