const cv = require('opencv4nodejs');
const comp = require('./compare.js');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose'); //mongoose client
const Mconf = require('./config/mongooseConfig');
const bodyParser = require('body-parser');
const express = require('express');
const writeNewImage = require('./extrudePntsAndDsk.js');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const multer = require('multer');

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


const uri = "mongodb+srv://Sylar:BreakingBad1@cluster0-meybi.mongodb.net/pictures?retryWrites=true&w=majority";
const db = mongoose.connect(uri,Mconf, (err,db)=>{
    if (err) return console.log(err);
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
  res.sendFile(__dirname + '/index.html');
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

    console.log(data);
  });

});











let imagesToCompare = [];
imagesToCompare = fs.readdirSync(directoryPath);
console.log(imagesToCompare)

let result = comp('../main/pyr6.jpg', imagesToCompare);
