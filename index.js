const express = require('express')
const app = express()
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'q1w2e3r4',
  database : 'fintech'
});
connection.connect();

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
    res.render('index')
})

app.get('/join', function (req, res) {
    res.render('join')
})

app.post('/join', function(req, res){
    var sql = 'INSERT INTO `fintech`.`user` (`name`, `birthday`, `user_id`, `user_password`, `phone`) VALUES (?,?,?,?,?);'
    connection.query(sql, function (error, results) {
      if (error) throw error;
      else {

      }
    });
})

app.get('/ajaxTest',function(req, res){
    console.log('ajax call');
    var result = "hello";
    res.json(result);
})

app.listen(3000)
