var express = require("express");
var parseString = require('xml2js').parseString;
var request = require('request');


app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


var port = process.env.PORT || 5000;
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    //res.send('Fighting change Team!!');
    res.send('<html><h1>'+"Fighting change Team!!" +'</h1></html>');
})
// 이제 시작----
app.listen(port);
console.log("Listening on port ", port);
