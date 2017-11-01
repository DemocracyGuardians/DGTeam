
var UNSPECIFIED_SYSTEM_ERROR = 'UNSPECIFIED_SYSTEM_ERROR'

exports.getlesson = function(req, res, next) {
  console.log("getlesson req", req.body);
  console.log('req.session.id='+req.session.id);
  console.log('req.path='+req.path);
  let mod = '../Lessons/'+req.path.substr('/getlesson/'.length);
  console.log('mod='+mod);
  let lesson = { success: false };
  try {
    lesson = require(mod);
    lesson.success = true;
    console.dir(lesson);
  } catch(e) {
    console.error('unable to load module='+mod);
  }
  let msg = "getlesson success.";
  console.log(msg);
  res.send(lesson)
}
