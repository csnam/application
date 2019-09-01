var express = require("express");
var parseString = require('xml2js').parseString;
var request = require('request');

//====================================== 
const axios = require("axios");
const cheerio = require("cheerio");
const iconv = require('iconv-lite');
const moment = require("moment"); 
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

//====================================== 

var auth = require('./lib/auth');

// 세션코드
var session = require('express-session');

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


// 세션코드
app.use(session({
    secret: '1234DSFs@adf1234!@#$asd',
    resave: false,
    saveUninitialized: true
}));


// 이제 시작----
app.listen(port);
console.log("Listening on port ", port);

function clsTransaction() { //transaction 클래스 초기화
    this.no = 0;
    this.user_num = 0;
    this.date = 0;
    this.sort = 0;
    this.change_amount = 0;
    this.change_unit = 0;
    this.USdollar_standard = 0;
    this.USdollar_amount = 0;
    this.point_amount = 0;
    this.point_exchange_rate = 0; 
    this.store_id = 0;
}
transData = new clsTransaction(); 

function clsUser() { //user 클래스 초기화
    this.no = 0;
    this.email_address = 0;
    this.name = 0;
    this.passwd = 0;
    this.address = 0;
    this.current_point = 0;
    this.qr_data = 0;
}
userData = new clsUser(); 


//======================================
//======================================

// 페이지 추가
// ------------사용자 페이지------------

// 기본페이지 (홈)
app.get('/', function(req, res){
    sess = req.session;
    res.render('login');
    console.log(sess.userEmail);
})

// 마이페이지
app.get('/mypage', function(req, res){


    var user = sess.username;

    var sql = "SELECT * FROM tbl_transaction a, tbl_user b, (SELECT SUM(a.point_amount) AS TOTAL FROM tbl_transaction a, tbl_user b where a.user_num = b.email_address and a.sort = 1 and b.email_address = ? and a.point_amount < 0 )c where b.email_address = ? and a.user_num = b.email_address and a.sort = 1;";

    connection.query(sql, [user, user], function(err, results){ 

        if(err){
            throw err;
        }

        else {

            if(results.length > 0){

                var sql2 = "SELECT * FROM tbl_transaction a, tbl_user b, (SELECT SUM(a.point_amount) AS TOTAL FROM tbl_transaction a, tbl_user b where a.user_num = b.email_address and a.sort = 0 and b.email_address = ? and a.point_amount > 0 )c where b.email_address = ? and a.user_num = b.email_address and a.sort = 0";

                connection.query(sql2, [user, user], function(err, results2){ 
            
                    if(err){
                        throw err;
                    }
            
                    else {
            
                        if(results2.length > 0){
            
                            res.render('mypage', {results:results, results2:results2}); // 데이터를 넘겨주기
                            console.log('성공')
                        
                            // results[0].password
                            // results[0].password
                                         
            
                        }
            
                    }
                })
            

            }

        }
    })


})

// app.post('/save', function (req, res) {

//     //var userEmail = req.body.email;

//     var user = sess.username;

//     var sql = "SELECT * FROM tbl_transaction a, tbl_user b, (SELECT SUM(a.point_amount) AS TOTAL FROM tbl_transaction a, tbl_user b where a.user_num = b.email_address and a.sort = 1 and b.email_address = ?)c where b.email_address = ? and a.user_num = b.email_address and a.sort = 0;";

//     connection.query(sql, [user, user], function(err, results2){ 

//         if(err){
//             throw err;
//         }

//         else {

//             if(results.length > 0){
//                 res.render('mypage', {results2:results2}); // 데이터를 넘겨주기
//             }

//         }
//     })

// })


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
   // sess = req.session;
    console.log("qr" + sess.username);
    res.render('qrcode', { data : sess.username});
})

// GPS 기반 제휴 상점 찾기
app.get('/searchGPS', function(req, res){
    res.render('searchGPS');
})

// 이름으로 제휴 상점 찾기
app.get('/searchName', function(req, res){
    res.render('searchName');
})

app.post('/getStoreName', function(req, res){
    console.log("/getStoreName");

    var storeName=  req.body.name; //req.decoded.name;
     
    var sql = "SELECT * FROM fintech.tbl_store where name like \"%"+storeName+"%\";";
    // console.log(storeName);
    connection.query(sql, [], function(err, result){
        if(err){
            console.error(err);
        }
        //console.log(result);
        res.json(result)
    })
})

// 회원가입
app.get('/join', function(req, res){
    res.render('join');
})

// 로그인
app.get('/login', function(req, res){
    res.render('login');
})

// 환급
app.get('/deposit', function(req, res){

    var sql = "SELECT * FROM tbl_user WHERE email_address = ?";

    var userId = sess.username;

    connection.query(sql, [userId], function (error, results) {

      if (error) throw error;  

      else {
        res.render('deposit', { data : results[0].current_point});
      }

    });
})


app.post('/login', function (req, res) {

    var userEmail = req.body.email;

    var userPassword = req.body.password;

    console.log(userEmail, userPassword);

    var sql = "SELECT * FROM tbl_user WHERE email_address = ?";

    connection.query(sql, [userEmail], function (error, results) {

      if (error) throw error;  

      else {

        console.log(userPassword, results[0].passwd);

        if(userPassword == results[0].passwd){

            sess = req.session;
            sess.username = userEmail
            console.log('세션' + sess.username)
            res.render('home');
            
        }

        else {

            res.json('등록정보가 없습니다');

        }

      }

    });

})

app.post('/getStoreGpsData', function(req, res){
    console.log("getStoreGpsData");
    var sql = "SELECT * FROM fintech.tbl_store;"
    connection.query(sql, [], function(err, result){
        if(err){
            console.error(err);
        }
        console.log(result);
        res.json(result)
    })
})


// ------------제휴업체 페이지------------

// 상점 페이지
app.get('/store', function(req, res){
    res.render('store');
})

// qr 인식페이지 (상점)
app.get('/qr', function(req, res){
    res.render('qr');
})

// 포인트 적립페이지 (상점)f
app.get('/storePoint', function(req, res){
    res.render('storePoint');
})

//포인트 인출 (qr)
app.post('/withdrawQR', function(req, res, next){

    var qrFin = req.body.qrFin;
    var point = req.body.point;

    transData.date = moment().format('YYYY-MM-DD');
    transData.time = moment().format('HH:mm:ss');


    console.log(qrFin);
    var sql = "UPDATE tbl_user SET current_point = current_point - ? WHERE email_address = ?";
    // var sql = "UPDATE tbl_user SET current_point = current_point - 5 WHERE email_address = ?";

    connection.query(sql, [qrFin], function(err, results){

        if(err){
            throw err;
        }

        else {

            var sql2 = "INSERT INTO tbl_transaction (user_num, date, time, sort, point_amount, store_id) VALUES (?, ?, ?, '1', ?, '옷가게')";

            var point2 = -1 * point

            connection.query(sql2, [qrFin, transData.date, transData.time, point2], function(err, results2){

                if(err){
                    throw err;
                }
        
                else {
        
                
                        console.log('데이터 삽입 성공')
                
        
                }
            })

        }
    })

})

//잔돈을 포인트로 
app.post('/changeToMoney', function(req, res, next){

    var user_num = req.body.user_num;
    //var user_num = sess.username;
    var store_id = '옷가게'; // 임시로 지정
    var sort = '0'; // 이체 종류는 
    var change_amount = req.body.change_amount;
    var myselect = req.body.myselect;

    request("https://finance.naver.com/marketindex/exchangeList.nhn", function (err, res, body) {
        const $ = cheerio.load(body);
        const bodyList = $(".tbl_exchange tbody tr").map(function (i, element) {
        var change_unit = $(element).find('td:nth-of-type(1)').text();

            if(change_unit.indexOf(myselect) != -1) {
                
                var USdollar_standard = $(element).find('td:nth-of-type(7)').text();   
                
                if((myselect == 'JPY') || (myselect == 'IDR') || (myselect == 'VND'))
                {
                    console.log(myselect);
                    USdollar_standard = ($(element).find('td:nth-of-type(7)').text())/100;
                }

                var USdollar_amount = change_amount*USdollar_standard;
                var point_exchange_rate = 0.8;
                
                console.log(user_num);
                console.log(moment().format('YYYY-MM-DD'));
                console.log(moment().format('HH:mm:ss'));
                console.log(sort);
                console.log(change_amount);
                console.log(myselect);
                console.log(USdollar_standard);
                console.log(USdollar_amount);
                console.log(USdollar_amount*point_exchange_rate);
                console.log(point_exchange_rate);
                console.log(store_id);

                transData.user_num = user_num;
                transData.date = moment().format('YYYY-MM-DD');
                transData.time = moment().format('HH:mm:ss');
                transData.sort = sort;
                transData.change_amount = change_amount;
                transData.change_unit = myselect;
                transData.USdollar_standard = USdollar_standard;
                transData.USdollar_amount = USdollar_amount;
                transData.point_amount = USdollar_amount*point_exchange_rate;
                transData.point_exchange_rate = point_exchange_rate;
                transData.store_id = '옷가게'; // 임시로 지정
                
                insert_table(transData);
                
        }
    })

})
})

function insert_table(a){
    if(a==transData)
    {
        var sql = "INSERT INTO `fintech`.`tbl_transaction`(`no`, `user_num`, `date`, `time`, `sort`, `change_amount`, `change_unit`, `USdollar_standard`, `USdollar_amount`, `point_amount`, `point_exchange_rate`, `store_id`) "
        + "VALUES (?,?,?,?,'0',?,?,?,?,?,?,?)" 

        connection.query(sql, [transData.no, transData.user_num, transData.date,
                           transData.time, transData.sort, transData.change_amount,
                           transData.change_unit, transData.USdollar_standard, transData.USdollar_amount,
                           transData.point_amount, transData.point_exchange_rate, transData.store_id], function(err, result){})
        
        var sql2 = "UPDATE tbl_user SET current_point = (SELECT SUM(point_amount) FROM tbl_transaction WHERE user_num = ?)  WHERE email_address =?"
        connection.query(sql2, [transData.user_num,transData.user_num], function(err, results){})
    }       
}

// 추가
//포인트 인출 (qr)
app.post('/deposit', function(req, res, next){

    var amount = req.body.amount;
    var userId = sess.username;
    transData.date = moment().format('YYYY-MM-DD');
    transData.time = moment().format('HH:mm:ss');

    console.log(amount);
    console.log(userId);

    if(amount >= 10000){
        var sql3 = "UPDATE tbl_user SET current_point = IF(current_point >= 10000, (current_point - ?), current_point)WHERE email_address = ?"
        connection.query(sql3, [amount, userId], function(err, results){
        }) 

        var sql4 = "INSERT INTO tbl_transaction (user_num, date, time, sort, point_amount, store_id) VALUES (?, ?, ?, '1', ?, '옷가게')";

        var amount = -1 * amount;
        connection.query(sql4, [userId, transData.date, transData.time, amount], function(err, results4){

            if(err){
                throw err;
            }
    
            else {
    
                    console.log('트랜잭션 성공')
            }
        })

    }else{
        console.log('만포인트 미만')
    }
})
