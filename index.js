var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require("dotenv").config();
var multiparty = require('multiparty');
const port = process.env.PORT || 8080;
//_________________________________//
const AWS = require('aws-sdk')
const fs = require('fs')
const ACCESS_KEY_ID = "AKIAXNLLRY7K57RVYJ7D"
const SECRET_ACCESS_KEY = process.env.AWS_Secret
const BUCKET_NAME = "alexunicovidapi"
app.get('/*',function(req,res){
    res.send("Welcome To Our API Post Your Data Please");
});
//var s3 = new AWS.S3({
//    accessKeyId: ACCESS_KEY_ID,
//    secretAccessKey: SECRET_ACCESS_KEY,
//})
//var params = {
//    Key: 'weights',
//    Bucket: BUCKET_NAME
//}
//s3.getObject(params, function(err, data) {
//    if (err) {
//       throw err
//    }
//    fs.writeFileSync('./weights', data.Body)
//    console.log('file downloaded successfully')
//})
app.post('/API',function(req,res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        console.log(files['notmygilr'][0].path);
        var spawn = require("child_process").spawn; 
        var process = spawn('python',["./last_ml.py",files['notmygilr'][0].path] );
                             process.stdout.on('data', function(data) { 
                                  console.log(data.toString());
                                  res.status(200);
                                  res.send(data.toString());
                                  process.kill();
                              });
    });
});
app.listen(port,function(){
    console.log("Server started on port : "+ port);
  });

