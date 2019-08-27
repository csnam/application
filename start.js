var express = require("express");
var parseString = require('xml2js').parseString;
var request = require('request');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'fintech6327',
  database : 'fintech'
});
connection.connect();

app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


var port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({extended : false}));

// 이제 시작----
app.listen(port);
console.log("Listening on port ", port);

// 페이지 추가
// ------------사용자 페이지------------

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

// qr 결제페이지 (고객)
app.get('/qrcode', function(req, res){
    res.render('qrcode');
    // 세션 만들기 - 유민
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



// ------------제휴업체 페이지------------

// qr 인식페이지 (상점)
app.get('/qr', function(req, res){
    res.render('qr');
})

// 포인트 적립페이지 (상점)
app.get('/storePoint', function(req, res){
    res.render('storePoint');
})

//포인트 인출 (qr)
app.post('/withdrawQR', function(req, res, next){

    var qrFin = req.body.qrFin;
    console.log(qrFin);
    var sql = "UPDATE tbl_user SET current_point = current_point - 3 WHERE email_address = ?";

    connection.query(sql, [qrFin], function(err, results){

        if(err){
            throw err;
        }

        else {

            if(results.length > 0){
                // 포인트가 0인 경우 등 조건 추가
                console.log('성공')
            }

        }
    })

})

//잔돈을 포인트로 
app.post('/changeToMoney', function(req, res, next){

    var change = req.body.change;
    console.log(change);

    // 여기서 돈을 포인트로 변환하는 코드 추가 *크롤링
    // 트랜잭션 테이블에 값 가져와서 추가

    var sql = "UPDATE tbl_user SET current_point = current_point + ? WHERE email_address = ?";

    connection.query(sql, [10, 'skymill2000'], function(err, results){ // 10은 임시값

        if(err){
            throw err;
        }

        else {

            if(results.length > 0){
                console.log('성공')
            }

        }
    })

})