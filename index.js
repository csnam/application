const express = require('express')
const app = express()
var request = require('request');
var mysql = require('mysql');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var auth = require('./lib/auth');
var tokenKey = 'f$i1nt#ec1hT@oke1n!Key'
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'q1w2e3r4',
  database : 'fintech'
});

connection.connect();
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.get('/', function (req, res) {
    res.render('index')
})

app.get('/login', function(req, res){
    res.render('login');
})

app.get('/join', function (req, res) {
    res.render('join')
})

app.get('/authResult', function(req, res){
    var auth_code = req.query.code
    var getTokenUrl = "https://testapi.open-platform.or.kr/oauth/2.0/token";
    var option = {
        method : "POST",
        url :getTokenUrl,
        headers : {
        },
        form : {
            code : auth_code,
            client_id : "l7xx9aeec8195c534ad9a0ebd55aa6bc9e81",
            client_secret : "ad78be0471d940359458864e3e15fe81",
            redirect_uri : "http://localhost:3000/authResult",
            grant_type : "authorization_code"
        }
    };
    request(option, function(err, response, body){
        if(err) throw err;
        else {
            console.log(body);
            var accessRequestResult = JSON.parse(body);
            console.log(accessRequestResult);
            res.render('resultChild', {data : accessRequestResult})
        }
    })
})

app.post('/join', function(req, res){
    console.log(req);
    var name = req.body.name;
    var birthday = new Date();
    var email = req.body.email;
    var password = req.body.password;
    var phone = "0109922";
    var accessToken = req.body.accessToken;
    var refreshToken = req.body.refreshToken;
    var useNum = req.body.useseqnum;

    console.log(name, email, password);
    var sql = 'INSERT INTO `fintech`.`user` (`name`, `birthday`, `user_id`, `user_password`, `phone`, accessToken, refreshToken, userseqnum) VALUES (?,?,?,?,?,?,?,?);'
    connection.query(sql,[name, birthday, email, password, phone, accessToken, refreshToken, useNum], function (error, results) {
      if (error) throw error;  
      else {
          console.log(this.sql);
          res.json(1);
      }
    });
})

app.post('/login', function (req, res) {
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    console.log(userEmail, userPassword);

    var sql = "SELECT * FROM user WHERE user_id = ?";
    connection.query(sql, [userEmail], function (error, results) {
      if (error) throw error;  
      else {

        console.log(userPassword, results[0].user_password);
        if(userPassword == results[0].user_password){
            jwt.sign(
                {
                    userName : results[0].name,
                    userId : results[0].user_id
                },
                tokenKey,
                {
                    expiresIn : '1d',
                    issuer : 'fintech.admin',
                    subject : 'user.login.info'
                },
                function(err, token){
                    console.log('로그인 성공', token)
                    res.json(token)
                }
            )            
        }
        else {
            res.json('등록정보가 없습니다');
        }
      }
    });
})

app.get('/tokenTest', auth ,function(req, res){
    console.log(req.decoded);
})

app.get('/ajaxTest',function(req, res){
    console.log('ajax call');
    var result = "hello";
    res.json(result);
})

app.listen(3000)
