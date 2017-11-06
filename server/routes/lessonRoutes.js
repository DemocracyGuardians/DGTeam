
var fs = require('fs');
var _eval = require('eval');
const logSend = require('../util/logSend')
var logSendOK = logSend.logSendOK
var logSendCE = logSend.logSendCE

var UNSPECIFIED_SYSTEM_ERROR = 'UNSPECIFIED_SYSTEM_ERROR'

exports.getlesson = function(req, res, next) {
  console.log("getlesson req", req.body);
  console.log('req.session.id='+req.session.id);
  console.log('req.path='+req.path);
  let lessonPath = './Lessons/'+req.path.substr('/getlesson/'.length)+'.js';
  console.log('lessonPath='+lessonPath);
  let lesson = { success: false };
  fs.readFile(lessonPath, 'utf8', function (err, data) {
    if (err) {
      logSendCE(res, 401, UNSPECIFIED_SYSTEM_ERROR, 'unable to load module='+lessonPath);
    } else {
      var lesson = _eval(data);
      lesson.success = true;
      console.dir(lesson);
      logSendOK(res, lesson, "getlesson success.");
    }
  });
}
