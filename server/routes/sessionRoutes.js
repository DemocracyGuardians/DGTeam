
const mysql = require('mysql')
const sendMail = require('../util/sendMail')
const crypto = require('crypto')

var TEAM_ORG = process.env.TEAM_ORG
var TEAM_BASE_URL = process.env.TEAM_BASE_URL
var TEAM_API_RELATIVE_PATH = process.env.TEAM_API_RELATIVE_PATH
var TEAM_UI_RELATIVE_PATH = process.env.TEAM_UI_RELATIVE_PATH
var TEAM_DB_HOST = process.env.TEAM_DB_HOST
var TEAM_DB_USER = process.env.TEAM_DB_USER
var TEAM_DB_PASSWORD = process.env.TEAM_DB_PASSWORD
var TEAM_DB_DATABASE = process.env.TEAM_DB_DATABASE

var apiUrl = TEAM_BASE_URL + TEAM_API_RELATIVE_PATH
var teamUrl = TEAM_BASE_URL + TEAM_UI_RELATIVE_PATH

var connection = mysql.createConnection({
  host: TEAM_DB_HOST,
  user: TEAM_DB_USER,
  password: TEAM_DB_PASSWORD,
  database: TEAM_DB_DATABASE,
  debug: false
});
connection.connect(function(error){
  if (!error) {
      console.log("Database connected");
  } else {
      console.log("Database connection error");
  }
});

exports.signup = function(req, res, next) {
  console.log("signup req", req.body);
  let now = new Date();
  const buf = crypto.randomBytes(8);
  let token = buf.toString('hex')
  let user = {
     firstName: req.body.firstName,
     lastName: req.body.lastName,
     email: req.body.email,
     password: req.body.password,
     vows: req.body.vows ? 1 : 0,
     agreement: req.body.agreement ? 1 : 0,
     emailValidateToken: token,
     emailValidateTokenDateTime: now,
     created: now,
     modified: now
   }
   connection.query('INSERT INTO ue_ztm_users SET ?', user, function (error, results, fields) {
     if (error) {
       let msg = "Insert new user insert database failure for email '" + user.email + "'";
       console.log(msg + ", error= ", error);
       res.send(401, { msg })
     } else {
       sendAccountVerificationEmail(user, function(error, result) {
         delete user.password
         if (error) {
           let msg = "Insert new user email send failure for email '" + user.email + "'";
           console.log(msg + ", error= ", error);
           res.send(402, { msg })
         } else {
           let msg = "Insert new user success for email '" + user.email + "'";
           console.log(msg + ", results= ", results);
           res.send({ msg, user })
         }
       })
     }
   });
}

exports.login = function(req, res, next) {
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

exports.loginexists = function(req, res, next) {
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

function sendAccountVerificationEmail(user, callback) {
  var url = apiUrl + '/verifyaccount/' + user.emailValidateToken
  var name = user.firstName+' '+user.lastName;
  var params = {
    html: `<p>Welcome to the ${TEAM_ORG} team!</p>
  <p>Please click on this link: </p>
  <p>&nbsp;&nbsp;&nbsp;&nbsp;<a href="${url}" style="font-size:110%;color:darkblue;font-weight:bold;">Activate My Account</a></p>
  to complete the signup process.</p>`,
    text: 'Welcome to the '+TEAM_ORG+' team!\n\nPlease go to the following URL in a Web browser to Activate Your Account and complete the signup process:\n\n'+url,
    subject: 'Please confirm your '+TEAM_ORG+' account',
    email: user.email,
    name: name
  };
  sendMail(params, function(err, result) {
    if (err) {
      console.error('sendAccountVerificationEmail sendMail failed! err='+JSON.stringify(err));
    } else {
      console.log('sendAccountVerificationEmail sendMail no errors.  result='+JSON.stringify(result));
    }
    callback(err, result)
  });
}

exports.verifyAccount = function(req, res, next) {
  console.log('verifyAccount req.params='+req.params);
  console.dir(req.params);
  let token = req.params.token
  res.type('html')
  connection.query('SELECT email, emailValidateTokenDateTime FROM ue_ztm_users WHERE emailValidateToken = ?', [token], function (error, results, fields) {
    if (error || results.length !== 1) {
      let msg = "verifyAccount failure for token '" + token + "'";
      console.log(msg + ", error= ", error, 'results=', JSON.stringify(results));
      let html = `<html><body>
  <h1>Invalid token in URL</h1>
  <p>If you copy/pasted the URL, could you have made a copy/paste error?</p>
</body></html>`
      res.send(html)
    } else {
      console.log("results= ", JSON.stringify(results));
      let { email, emailValidateTokenDateTime } = results[0]
      console.log('typeof emailValidateTokenDateTime= ', typeof emailValidateTokenDateTime)
      let msg = "verifyAccount success for email '" + email + "'";
      let now = new Date();
      let twentyfourHoursAgo = (new Date().getTime() - (24 * 60 * 60 * 1000));
      let tokenTime = emailValidateTokenDateTime.getTime()
      console.log('tokenTime='+tokenTime+', twentyfourHoursAgo='+twentyfourHoursAgo)
      if (tokenTime < twentyfourHoursAgo) {
        let html = `<html><body>
<h1>Sorry! Verification expiration</h1>
<p>Please send email to info@${TEAM_BASE_URL} to report the problem.</p>
</body></html>`
        res.send(html)
      } else {
        console.log('now='+now+', email='+email)
        connection.query('UPDATE ue_ztm_users SET emailValidated = ? WHERE email = ?', [now, email], function (error, results, fields) {
          console.log('error='+error+", results= ", JSON.stringify(results));
          if (error) {
            let msg = "verifyAccount update emailValidated database failure for email '" + user.email + "'";
            console.log(msg + ", error= ", error);
            let html = `<html><body>
  <h1>Sorry! Unknown system error</h1>
  <p>Please send email to info@${TEAM_BASE_URL} to report the problem.</p>
</body></html>`
console.log('html='+html) ;
            res.send(html)
          } else {
            console.log('before setting html ')
            let html = `<html><body>
  <h1>Account verified!</h1>
  <p> Now you can go to <a href="${teamUrl}">${teamUrl}</a> to start contributing to ${TEAM_ORG}.</p>
</body></html>`
            res.send(html)
          }
        });
      }
    }
  });
}
