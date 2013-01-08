
/**
 * Module dependencies.
 */

var express = require('express');

var app = express();

app.use(express.logger('dev'));
app.use(express.bodyParser());

app.get('/', function(req, res){
  res.sendfile('test/tests.html');
});

app.post('/upload', function(req, res){
  var file = req.files.file;
  console.log('uploaded %s', file.name);
  if (file) return res.send(200);
  res.send(400);
});

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/..'));

app.listen(4000);
console.log('listening on port 4000');
