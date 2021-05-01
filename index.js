const performance = require('perf_hooks');
var express = require('express');
const fs = require('fs');
var app = express();
var cors = require('cors');
app.use(cors());
require('dotenv').config();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var multiparty = require('multiparty');
const AWS = require('aws-sdk');
const { response } = require('express');
const port = process.env.PORT || 8080;
//_________________________________//
const ID = process.env.Access_Key_ID;
const SECRET = process.env.Secret_Access_Key;
const BUCKET_NAME = process.env.Bucket_Name;
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});
//________________________________//
async function pythonHandle(filepath , Start , callback){
    var spawn = require("child_process").spawn; 
    var process = spawn('python',["./last_ml.py",filepath]);
    process.stdout.on('data', async function(data) { 
        console.log(data.toString());
        const value = await data.toString();
            var end = new Date().getTime();
            var time = (end - Start) / 1000;
            console.log(time + "  Seconds");
            process.kill();
            callback(value);});
};
function aws_Handle(user_Key, filepath){
    var para = user_Key;
    var awsPath = para.Email + '/' + para.TestNumber + '.' + para.Format;
    const fileContent = fs.readFileSync(filepath);
    const params = {
        Bucket: BUCKET_NAME,
        Key: awsPath, 
        Body: fileContent
    };
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
}
app.get('/*',function(req,res){
    res.send("Welcome To Our Covid API Post Your Data Please");
});
app.post('/API',function(req,res){
    var tempFilePath;
    var start = new Date().getTime();
    var form = new multiparty.Form();
    form.parse(req,  async function(err, fields, files) {
        tempFilePath = files['file'][0].path;
        if(files['file'] == null){console.log("wrong Input"); res.status(500);
        res.send("Server Error"); return;}
        console.log(tempFilePath);
        pythonHandle(tempFilePath,start,function(response){
        try {
                res.status(200);
                res.send(response);}
        catch (error) {
                res.status(500);
                res.send("Server Error");}
        });
        aws_Handle(req.query,tempFilePath);
      });
});
app.listen(port,function(){
    console.log("Server started on port : "+ port);
  });

