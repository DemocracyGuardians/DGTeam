
const readlesson = require('../util/readlesson');
const getUserObject = require('../util/getUserObject');
const logSend = require('../util/logSend');
var logSendOK = logSend.logSendOK
var logSendCE = logSend.logSendCE
var logSendSE = logSend.logSendSE

var UNSPECIFIED_SYSTEM_ERROR = 'UNSPECIFIED_SYSTEM_ERROR'

exports.getlesson = function(req, res, next) {
  let account = JSON.parse(JSON.stringify(req.session.user));
  let lessonPath = req.path.substr('/getlesson/'.length);
  let tokens = lessonPath.split('/');
  readlesson(tokens[0], tokens[1]).then(lesson => {
    getUserObject(account.email, { account }).then(userObject => {
      userObject.lesson = lesson;
      logSendOK(res, userObject, "getlesson success.");
    }).catch(error => {
      logSendSE(res, error, 'getlesson getUserObjectError');
    });
  }).catch(error => {
    logSendCE(res, 401, UNSPECIFIED_SYSTEM_ERROR, error);
  });
}
