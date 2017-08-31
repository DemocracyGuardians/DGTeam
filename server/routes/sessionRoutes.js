
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

exports.signup = function(req, res){
  console.log("signup req", req.body);
  let now = new Date();

  let user = {
     firstName: req.body.firstName,
     lastName: req.body.lastName,
     email: req.body.email,
     password: req.body.password,
     vows: req.body.vows ? 1 : 0,
     agreement: req.body.agreement ? 1 : 0,
     created: now,
     modified: now
   }
   connection.query('INSERT INTO ue_ztm_users SET ?', user, function (error, results, fields) {
     if (error) {
       let msg = "Insert new user failure for email '" + user.email + "'";
       console.log(msg + ", error= ", error);
       res.send(400, { msg })
     } else {
       delete user.password
       let msg = "Insert new user success for email '" + user.email + "'";
       console.log(msg + ", results= ", results);
       res.send({ msg, user })
     }
   });
}

exports.login = function(req, res){
  console.log('login req.body='+req.body);
  console.dir(req.body);
  var email = req.body.email;
  var password = req.body.password;
  console.log('email='+email);
  connection.query('SELECT * FROM ue_ztm_users WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      let msg = "Select user failure for email '" + email + "'";
      console.log(msg + ", error= ", error);
      res.send(400, { msg })
    } else {
      let msg = "Select user success for email '" + email + "'";
      console.log(msg + ", results= ", results);
      if (results.length > 0) {
        let user = results[0]
        if (user.password === password) {
          delete user.password
          let msg = "Login success for email '" + email + "'";
          res.send({ msg, user })
        } else {
          let msg = "Login failure for email '" + email + "'";
          res.send(401, { msg })
        }
      }
    }
  });
}

exports.loginexists = function(req, res){
  console.log('loginexists req.body='+req.body);
  console.dir(req.body);
  var email = req.body.email;
  console.log('email='+email);
  connection.query('SELECT email FROM ue_ztm_users WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      let msg = "loginexists failure for email '" + email + "'";
      console.log(msg + ", error= ", error);
      res.send(400, { msg })
    } else {
      let msg = "loginexists success for email '" + email + "'";
      console.log(msg + ", results= ", results);
      let exists = (results.length > 0)
      res.send({ msg, email, exists })
    }
  });
}
