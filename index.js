var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var multiparty = require('multiparty');
const port = process.env.PORT || 8080;
app.get('/*',function(req,res){
    res.send("Welcome To Our API Post Your Data Please");
});
app.post('/API',function(req,res){
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        console.log(files['notmygilr'][0].path);
        var spawn = require("child_process").spawn; 
        var process = spawn('python',["./last_ml.py",files['notmygilr'][0].path] );
                             process.stdout.on('data', function(data) { 
             
                              //   Database.submitData(data.toString(),req.body.email);
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