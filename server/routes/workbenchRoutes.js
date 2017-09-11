
var UNSPECIFIED_SYSTEM_ERROR = 'UNSPECIFIED_SYSTEM_ERROR'

exports.workbenchinit = function(req, res, next) {
  console.log("workbenchinit req", req.body);
  console.log('req.session.id='+req.session.id);
  let msg = "workbenchinit success.";
  console.log(msg);
  res.send({ msg })
}
