
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: "tdamysqlwp",
  password: "ue3466428#",
  database: 'ue'
});
connection.connect(function(error){
  if (!error) {
      console.log("Database connected");
  } else {
      console.log("Database connection error");
  }
});

exports.register = function(req, res){
  console.log("req", req.body);
  var now = new Date();

   var users = {
     first_name: req.body.first_name,
     last_name: req.body.last_name,
     email: req.body.email,
     password: req.body.password,
     created: now,
     modified: now
   }
   connection.query('INSERT INTO ue_ztm_users SET ?', users, function (error, results, fields) {
     if (error) {
       let msg = "Insert new user failure for email '" + users.email + "'";
       console.log(msg + ", error= ", error);
       res.send({
         "code": 400,
         "msg": msg
       })
     } else {
       let msg = "Insert new user success for email '" + users.email + "'";
       console.log(msg + ", results= ", results);
       res.send({
         "code": 200,
         "msg": msg
       })
     }
   });
}

exports.login = function(req, res){
  console.log('req.body='+req.body);
  console.dir(req.body);
  var email = req.body.email;
  var password = req.body.password;
  console.log('email='+email);
  connection.query('SELECT * FROM ue_ztm_users WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      let msg = "Select user failure for email '" + email + "'";
      console.log(msg + ", error= ", error);
      res.send({
        "code": 400,
        "msg": msg
      })
    } else {
      let msg = "Select user success for email '" + email + "'";
      console.log(msg + ", results= ", results);
      if (results.length > 0){
        if (results[0].password === password) {
          let msg = "Passwords match for email '" + email + "'";
          res.send({
            "code": 200,
            "msg": msg
          })
        } else {
          let msg = "Passwords do not match for email '" + email + "'";
          res.send({
            "code": 401,
            "msg": msg
          })
        }
      }
    }
  });
}
