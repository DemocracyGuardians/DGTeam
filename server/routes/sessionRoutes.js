
const dbconnection = require('../util/dbconnection')
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
var resendUrl = teamUrl + '/resendverification'

var UNSPECIFIED_SYSTEM_ERROR = 'UNSPECIFIED_SYSTEM_ERROR'
var USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS'
var USER_ALREADY_LOGGED_IN = 'USER_ALREADY_LOGGED_IN'
var EMAIL_NOT_REGISTERED = 'EMAIL_NOT_REGISTERED'
var EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED'
var EMAIL_ALREADY_VERIFIED = 'EMAIL_ALREADY_VERIFIED'
var INCORRECT_PASSWORD = 'INCORRECT_PASSWORD'

var connection = dbconnection.getConnection();

exports.signup = function(req, res, next) {
  console.log("signup req", req.body);
  let now = new Date();
  let user = {
     firstName: req.body.firstName,
     lastName: req.body.lastName,
     email: req.body.email,
     password: req.body.password,
     vows: req.body.vows ? 1 : 0,
     agreement: req.body.agreement ? 1 : 0,
     emailValidateToken: null,
     emailValidateTokenDateTime: now,
     created: now,
     modified: now
   }
   var token = makeToken(user)
   user.emailValidateToken = token
   connection.query('SELECT email FROM ue_ztm_users WHERE email = ?', [user.email], function (error, results, fields) {
     if (error) {
       let msg = "signup select user database failure for email '" + user.email + "'";
       console.log(msg + ", error= ", error);
       res.send(500, { msg, error: UNSPECIFIED_SYSTEM_ERROR })
     } else {
       if (results.length >= 1) {
         let msg = "signup user already exists: '" + user.email + "'";
         console.log(msg + ", error= ", error);
         res.send(401, { msg, error: USER_ALREADY_EXISTS })
       } else {
         connection.query('INSERT INTO ue_ztm_users SET ?', user, function (error, results, fields) {
           if (error) {
             let msg = "Insert new user insert database failure for email '" + user.email + "'";
             console.log(msg + ", error= ", error);
             res.send(500, { msg, error: UNSPECIFIED_SYSTEM_ERROR })
           } else {
             sendAccountVerificationEmail(user, function(error, result) {
               delete user.password
               if (error) {
                 let msg = "Insert new user email send failure for email '" + user.email + "'";
                 console.log(msg + ", error= ", error);
                 connection.query('DELETE FROM ue_ztm_users WHERE email = ?', [user.email], function (error, results, fields) {
                   if (error) {
                     console.error('DELETE failed after sendMail failure. error='+error)
                   }
                   res.send(500, { msg, error: UNSPECIFIED_SYSTEM_ERROR })
                 });
               } else {
                 let msg = "Insert new user success for email '" + user.email + "'";
                 console.log(msg + ", results= ", results);
                 res.send({ msg, user })
               }
             });
           }
         });
       }
     }
   });
}

exports.login = function(req, res, next) {
  console.log('login req.body='+req.body);
  console.dir(req.body);
  console.log('req.session.id='+req.session.id);
  var email = req.body.email;
  var password = req.body.password;
  console.log('email='+email);
  connection.query('SELECT * FROM ue_ztm_users WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      let msg = "Select user failure for email '" + email + "'";
      console.error(msg + ", error= ", error);
      res.send(500, { msg, error: UNSPECIFIED_SYSTEM_ERROR })
    } else {
      let msg = "Select user success for email '" + email + "'";
      console.log(msg + ", results= ", results);
      if (results.length < 1) {
        let msg = "No account for '" + email + "'";
        console.error(msg);
        res.send(401, { msg, error: EMAIL_NOT_REGISTERED })
      } else {
        let user = results[0]
        if (!user.emailValidated) {
          let msg = "Account for '" + email + "' has not been verified yet via email";
          console.error(msg);
          res.send(401, { msg, error: EMAIL_NOT_VERIFIED })
        } else {
          if (user.password === password) {
            delete user.password
            console.log('Before calling session login.  User='+user);
            console.dir(user);
            console.log('req.session.id='+req.session.id);
            req.session.user = user;
            console.log('login after regenerate req.session.id='+req.session.id);
            let msg = "Login success for email '" + email + "'";
            console.log(msg);
            res.send({ msg, user })
          } else {
            let msg = "Login failure for email '" + email + "'";
            res.send(401, { msg, error: INCORRECT_PASSWORD })
          }
        }
      }
    }
  });
}

exports.logout = function(req, res, next) {
  console.log('logout req.body='+req.body);
  console.dir(req.body);
  console.log('req.session.id='+req.session.id);
  req.session.user = null;
  let msg = "Logout success";
  console.log(msg);
  console.log('req.session.id='+req.session.id);
  res.send({ msg })

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
      res.send(500, { msg, error: UNSPECIFIED_SYSTEM_ERROR })
    } else {
      let msg = "loginexists success for email '" + email + "'";
      console.log(msg + ", results= ", results);
      let exists = (results.length > 0)
      res.send({ msg, email, exists })
    }
  });
}

exports.resendVerificationEmail = function(req, res, next) {
  console.log('resendVerificationEmail req.body='+req.body);
  console.dir(req.body);
  var email = req.body.email;
  console.log('email='+email);
  connection.query('SELECT * FROM ue_ztm_users WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      let msg = "resendVerificationEmail database failure for email '" + email + "'";
      console.log(msg + ", error= ", error);
      res.send(500, { msg, error: UNSPECIFIED_SYSTEM_ERROR })
    } else {
      let msg = "resendVerificationEmail database success for email '" + email + "'";
      console.log(msg + ", results= ", results);
      let exists = (results.length > 0)
      if (exists) {
        var user = results[0]
        if (user.emailValidated) {
          let msg = "resendVerificationEmail account already verified for email '" + email + "'";
          console.log(msg + ", error= ", error);
          res.send(400, { msg, error: EMAIL_ALREADY_VERIFIED })
        } else {
          var token = makeToken(user)
          let now = new Date();
          connection.query('UPDATE ue_ztm_users SET emailValidateToken = ?, emailValidateTokenDateTime = ?, modified = ? WHERE email = ?', [token, now, now, email], function (error, results, fields) {
            if (error) {
              let msg = "resendVerificationEmail update database failure for email '" + user.email + "'";
              console.log(msg + ", error= ", error);
              res.send(500, { msg, error: UNSPECIFIED_SYSTEM_ERROR })
            } else {
              user.emailValidateToken = token
              user.emailValidateTokenDateTime = now
              user.modified = now
              sendAccountVerificationEmail(user, function(error, result) {
                delete user.password
                if (error) {
                  let msg = "resendVerificationEmail email send failure for email '" + user.email + "'";
                  console.log(msg + ", error= ", error);
                  res.send(500, { msg, error: UNSPECIFIED_SYSTEM_ERROR })
                } else {
                  let msg = "resendVerificationEmail success for email '" + user.email + "'";
                  console.log(msg + ", results= ", results);
                  res.send({ msg, user })
                }
              });
            }
          });
        }
      } else {
        let msg = "No account for '" + email + "'";
        console.error(msg);
        res.send(401, { msg, error: EMAIL_NOT_REGISTERED })
      }
    }
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
  <h1>Account Verification Failure</h1>
  <p>This is most likely because you clicked on Activate My Account from an older account verification email.
    Only the most recent account verification email will work correctly.
    If you are unsure which email is the most recent,
    put all existing verification emails into the Trash,
    then go to <a href="${resendUrl}">${resendUrl}</a> to request a brand new account verification email.</p>
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
        connection.query('UPDATE ue_ztm_users SET emailValidated = ?, modified = ? WHERE email = ?', [now, now, email], function (error, results, fields) {
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

function makeToken(user) {
  const buf = crypto.randomBytes(8);
  let token = buf.toString('hex')
  return token
}
