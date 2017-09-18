
const dbconnection = require('../util/dbconnection')
const sendMail = require('../util/sendMail')
const crypto = require('crypto')
const logSend = require('../util/logSend')
var logSendOK = logSend.logSendOK
var logSendCE = logSend.logSendCE
var logSendSE = logSend.logSendSE

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
var resendVerificationUrl = teamUrl + '/resendverification'
var forgotPasswordUrl = teamUrl + '/forgot'
var resetPasswordUrl = teamUrl + '/resetpassword'

var USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS'
var USER_ALREADY_LOGGED_IN = 'USER_ALREADY_LOGGED_IN'
var EMAIL_NOT_REGISTERED = 'EMAIL_NOT_REGISTERED'
var EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED'
var EMAIL_ALREADY_VERIFIED = 'EMAIL_ALREADY_VERIFIED'
var INCORRECT_PASSWORD = 'INCORRECT_PASSWORD'
var TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND'
var TOKEN_EXPIRED = 'TOKEN_EXPIRED'

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
       logSendSE(res, error, "signup select user database failure for email '" + user.email + "'");
     } else {
       if (results.length >= 1) {
         logSendCE(res, 401, USER_ALREADY_EXISTS, "signup user already exists: '" + user.email + "'");
       } else {
         connection.query('INSERT INTO ue_ztm_users SET ?', user, function (error, results, fields) {
           if (error) {
             logSendSE(res, 500, error, UNSPECIFIED_SYSTEM_ERROR, "Insert new user insert database failure for email '" + user.email + "'");
           } else {
             sendAccountVerificationEmailToUser(user, function(error, result) {
               delete user.password
               if (error) {
                 console.error("Insert new user email send failure for email '" + user.email + "', error= ", error);
                 connection.query('DELETE FROM ue_ztm_users WHERE email = ?', [user.email], function (error, results, fields) {
                   if (error) {
                     console.error('DELETE failed after sendMail failure. error='+error)
                   }
                   res.send(500, { msg, error: UNSPECIFIED_SYSTEM_ERROR })
                 });
               } else {
                 logSendOK(res, {user}, "Insert new user success for email '" + user.email + "'");
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
      logSendSE(res, error, "Select user failure for email '" + email + "'");
    } else {
      let msg = "Select user success for email '" + email + "'";
      console.log(msg + ", results= ", results);
      if (results.length < 1) {
        logSendCE(res, 401, EMAIL_NOT_REGISTERED, "No account for '" + email + "'");
      } else {
        let user = results[0]
        if (!user.emailValidated) {
          logSendCE(res, 401, EMAIL_NOT_VERIFIED, "Account for '" + email + "' has not been verified yet via email");
        } else {
          if (user.password === password) {
            delete user.password
            console.log('Before calling session login.  User='+user);
            console.dir(user);
            console.log('req.session.id='+req.session.id);
            req.session.user = user;
            console.log('login after regenerate req.session.id='+req.session.id);
            logSendOK(res, {user}, "Login success for email '" + email + "'");
          } else {
            logSendCE(res, 401, INCORRECT_PASSWORD, "Login failure for email '" + email + "'");
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
  logSendOK(res, null, "Logout success");
}

exports.loginexists = function(req, res, next) {
  console.log('loginexists req.body='+req.body);
  console.dir(req.body);
  var email = req.body.email;
  console.log('email='+email);
  connection.query('SELECT email FROM ue_ztm_users WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      logSendSE(res, error, "loginexists failure for email '" + email + "'");
    } else {
      let exists = (results.length > 0)
      logSendOK(res, { email, exists }, "loginexists success for email '" + email + "'");
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
      logSendSE(res, error, "resendVerificationEmail database failure for email '" + email + "'");
    } else {
      let msg = "resendVerificationEmail database success for email '" + email + "'";
      console.log(msg + ", results= ", results);
      let exists = (results.length > 0)
      if (exists) {
        var user = results[0]
        if (user.emailValidated) {
          logSendCE(res, 400, EMAIL_ALREADY_VERIFIED, "resendVerificationEmail account already verified for email '" + email + "'");
        } else {
          var token = makeToken(user)
          let now = new Date();
          connection.query('UPDATE ue_ztm_users SET emailValidateToken = ?, emailValidateTokenDateTime = ?, modified = ? WHERE email = ?', [token, now, now, email], function (error, results, fields) {
            if (error) {
              logSendSE(res, error, "resendVerificationEmail update database failure for email '" + user.email + "'");
            } else {
              user.emailValidateToken = token
              user.emailValidateTokenDateTime = now
              user.modified = now
              sendAccountVerificationEmailToUser(user, function(error, result) {
                delete user.password
                if (error) {
                  logSendSE(res, error, "resendVerificationEmail email send failure for email '" + user.email + "'");
                } else {
                  logSendOK(res, { user }, "resendVerificationEmail success for email '" + user.email + "'");
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

exports.sendResetPasswordEmail = function(req, res, next) {
  console.log('sendResetPasswordEmail req.body='+req.body);
  console.dir(req.body);
  var email = req.body.email;
  console.log('email='+email);
  connection.query('SELECT * FROM ue_ztm_users WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      logSendSE(res, error, "sendResetPasswordEmail database failure for email '" + email + "'");
    } else {
      let msg = "sendResetPasswordEmail database success for email '" + email + "'";
      console.log(msg + ", results= ", results);
      let exists = (results.length > 0)
      if (exists) {
        var user = results[0]
        var token = makeToken(user)
        let now = new Date();
        connection.query('UPDATE ue_ztm_users SET resetPasswordToken = ?, resetPasswordTokenDateTime = ?, modified = ? WHERE email = ?', [token, now, now, email], function (error, results, fields) {
          if (error) {
            logSendSE(res, error, "sendResetPasswordEmail update database failure for email '" + user.email + "'");
          } else {
            user.resetPasswordToken = token
            user.resetPasswordTokenDateTime = now
            user.modified = now
            sendResetPasswordEmailToUser(user, function(error, result) {
              delete user.password
              if (error) {
                logSendSE(res, error, "sendResetPasswordEmail email send failure for email '" + user.email + "'");
              } else {
                console.log("results= ", results);
                logSendOK(res, { user }, "sendResetPasswordEmail success for email '" + user.email + "'");
              }
            });
          }
        });
      } else {
        logSendCE(res, 401, EMAIL_NOT_REGISTERED, "No account for '" + email + "'");
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
    then go to <a href="${resendVerificationUrl}">${resendVerificationUrl}</a> to request a brand new account verification email.</p>
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
<p>Please go to <a href="${resendVerificationUrl}">${resendVerificationUrl}</a> to request a new account verification email.</p>
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

exports.gotoResetPasswordPage = function(req, res, next) {
  console.log('gotoResetPasswordPage req.params='+req.params);
  console.dir(req.params);
  let token = req.params.token
  res.type('html')
  connection.query('SELECT email, resetPasswordTokenDateTime FROM ue_ztm_users WHERE resetPasswordToken = ?', [token], function (error, results, fields) {
    if (error || results.length !== 1) {
      let msg = "gotoResetPasswordPage failure for token '" + token + "'";
      console.log(msg + ", error= ", error, 'results=', JSON.stringify(results));
      let html = `<html><body>
  <h1>Reset Password Failure</h1>
  <p>This is most likely because you clicked on Reset My Password from an older password reset email.
    Only the most recent password reset email will work correctly.
    If you are unsure which email is the most recent,
    put all existing password reset emails into the Trash,
    then go to <a href="${forgotPasswordUrl}">${forgotPasswordUrl}</a> to request a brand new password reset email.</p>
</body></html>`
      res.send(html)
    } else {
      console.log("results= ", JSON.stringify(results));
      let { email, resetPasswordTokenDateTime } = results[0]
      console.log('typeof resetPasswordTokenDateTime= ', typeof resetPasswordTokenDateTime)
      let msg = "gotoResetPasswordPage success for email '" + email + "'";
      let now = new Date();
      let twentyfourHoursAgo = (new Date().getTime() - (24 * 60 * 60 * 1000));
      let tokenTime = resetPasswordTokenDateTime.getTime()
      console.log('tokenTime='+tokenTime+', twentyfourHoursAgo='+twentyfourHoursAgo)
      if (tokenTime < twentyfourHoursAgo) {
        let html = `<html><body>
<h1>Reset password expiration</h1>
<p>Please go to <a href="${forgotPasswordUrl}">${forgotPasswordUrl}</a> to request a new password reset email.</p>
</body></html>`
        res.send(html)
      } else {
        console.log('before sending redirect')
        res.redirect(302, resetPasswordUrl+'?t='+token)
      }
    }
  });
}

exports.resetPassword = function(req, res, next) {
  console.log('resetpassword req.body='+req.body);
  console.dir(req.body);
  var password = req.body.password;
  var token = req.body.token;
  console.log('req.session.id='+req.session.id);
  connection.query('SELECT email, resetPasswordTokenDateTime FROM ue_ztm_users WHERE resetPasswordToken = ?', [token], function (error, results, fields) {
    if (error || results.length !== 1) {
      logSendCE(res, 400, TOKEN_NOT_FOUND, "resetPassword select failure for token '" + token + "'");
    } else {
      console.log("results= ", JSON.stringify(results));
      let { email, resetPasswordTokenDateTime } = results[0]
      console.log('typeof resetPasswordTokenDateTime= ', typeof resetPasswordTokenDateTime)
      let msg = "resetPassword success for email '" + email + "'";
      let now = new Date();
      let twentyfourHoursAgo = (new Date().getTime() - (24 * 60 * 60 * 1000));
      let tokenTime = resetPasswordTokenDateTime.getTime()
      console.log('tokenTime='+tokenTime+', twentyfourHoursAgo='+twentyfourHoursAgo)
      if (tokenTime < twentyfourHoursAgo) {
        logSendCE(res, 400, TOKEN_EXPIRED, "resetPassword expired token for email '" + email + "'");
      } else {
        console.log('now='+now+', email='+email)
        connection.query('UPDATE ue_ztm_users SET password = ?, resetPasswordToken = NULL, resetPasswordTokenDateTime = NULL, modified = ? WHERE email = ?', [password, now, email], function (error, results, fields) {
          console.log('error='+error+", results= ", JSON.stringify(results));
          if (error) {
            logSendSE(res, error, "resetPassword update resetPasswordToken database failure for email '" + user.email + "'");
          } else {
            logSendOK(res, null, 'resetpassword success');
          }
        });
      }
    }
  });
}

function sendAccountVerificationEmailToUser(user, callback) {
  var url = apiUrl + '/verifyaccount/' + user.emailValidateToken
  var name = user.firstName+' '+user.lastName;
  var params = {
    html: `<p>Welcome to the ${TEAM_ORG} team!</p>
  <p>Please click on this link: </p>
  <p>&nbsp;&nbsp;&nbsp;&nbsp;<a href="${url}" style="font-size:110%;color:darkblue;font-weight:bold;">Activate My Account</a></p>
  <p>to complete the signup process.</p>`,
    text: 'Welcome to the '+TEAM_ORG+' team!\n\nPlease go to the following URL in a Web browser to Activate Your Account and complete the signup process:\n\n'+url,
    subject: 'Please confirm your '+TEAM_ORG+' account',
    email: user.email,
    name: name
  };
  sendMail(params, function(err, result) {
    if (err) {
      console.error('sendAccountVerificationEmailToUser sendMail failed! err='+JSON.stringify(err));
    } else {
      console.log('sendAccountVerificationEmailToUser sendMail no errors.  result='+JSON.stringify(result));
    }
    callback(err, result)
  });
}

function sendResetPasswordEmailToUser(user, callback) {
  var url = apiUrl + '/gotoresetpasswordpage/' + user.resetPasswordToken
  var name = user.firstName+' '+user.lastName;
  var params = {
    html: `<p>Reset your ${TEAM_ORG} password</p>
  <p>Please click on this link to reset your password: </p>
  <p>&nbsp;&nbsp;&nbsp;&nbsp;<a href="${url}" style="font-size:110%;color:darkblue;font-weight:bold;">Reset My Password</a></p>`,
    text: 'Please go to the following URL in a Web browser to reset your password:\n\n'+url,
    subject: 'Reset your '+TEAM_ORG+' password',
    email: user.email,
    name: name
  };
  sendMail(params, function(err, result) {
    if (err) {
      console.error('sendResetPasswordEmailToUser sendMail failed! err='+JSON.stringify(err));
    } else {
      console.log('sendResetPasswordEmailToUser sendMail no errors.  result='+JSON.stringify(result));
    }
    callback(err, result)
  });
}

function makeToken(user) {
  const buf = crypto.randomBytes(8);
  let token = buf.toString('hex')
  return token
}
