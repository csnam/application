var express = require("express");
var parseString = require('xml2js').parseString;
var request = require('request');


app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));


// 이제 시작----
app.listen(port);
console.log("Listening on port ", port);

// 페이지 추가

// 기본페이지 (홈)
app.get('/', function(req, res){
    res.render('home');
})

// 마이페이지
app.get('/mypage', function(req, res){
    res.render('mypage');
})

// 환율페이지
app.get('/exchangeRate', function(req, res){
    res.render('exchangeRate');
})

// 포인트 적립 페이지 (상점 -> 고객)
app.get('/LoadingPoint', function(req, res){
    res.render('LoadingPoint');
})

// qr 인식페이지
app.get('/qr', function(req, res){
    res.render('qr');
})

// GPS 기반 제휴 상점 찾기
app.get('/searchGPS', function(req, res){
    res.render('searchGPS');
})

// 이름으로 제휴 상점 찾기
app.get('/searchName', function(req, res){
    res.render('searchName');
})

// 회원가입
app.get('/join', function(req, res){
    res.render('join');
})

// 로그인
app.get('/login', function(req, res){
    res.render('login');
})