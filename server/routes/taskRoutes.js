
const dbconnection = require('../util/dbconnection')
const latest = require('../Tasks/latest')
const readlesson = require('../util/readlesson');
const getUserObject = require('../util/getUserObject')
const getBaseName = require('../util/getBaseName')
const logSend = require('../util/logSend')
var logSendOK = logSend.logSendOK
var logSendCE = logSend.logSendCE
var logSendSE = logSend.logSendSE

var UNSPECIFIED_SYSTEM_ERROR = 'UNSPECIFIED_SYSTEM_ERROR'

var connection = dbconnection.getConnection();

exports.updateprogress = function(req, res, next) {
  console.log('enter updateprogress');
  let userId = req.session.user && req.session.user.id;
  let account = JSON.parse(JSON.stringify(req.session.user));
  if (typeof userId !== 'number') {
    let msg = 'session userId not a number';
    logSendSE(res, msg, msg);
  } else {
    let updatedProgress = req.body;
    console.log('updatedProgress='+JSON.stringify(updatedProgress));
    if (updatedProgress.version !== latest.version) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'Tasks version number '+updatedProgress.version+' is out of date', {});
    } else if (!latest.levels[updatedProgress.level]) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'invalid level:'+updatedProgress.level, {});
    } else if (!latest.levels[updatedProgress.level].tasks[updatedProgress.task]) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'invalid task:'+updatedProgress.task, {});
    } else {
      let progressPromise = new Promise((progressResolve, progressReject) => {
        connection.query('SELECT * FROM ue_ztm_progress WHERE userId = ?', [account.id], function (error, results, fields) {
          if (error) {
            progressReject("updateprogress database failure for query progress for email '" + account.email + "'");
          } else {
            if (results.length === 1) {
              let oldProgress = results[0];
              if (updatedProgress.level > oldProgress.level ||
                  (updatedProgress.level === oldProgress.level && updatedProgress.task > oldProgress.task) ||
                  (updatedProgress.level === oldProgress.level && updatedProgress.task === oldProgress.task &&
                  updatedProgress.subtask > oldProgress.subtask)) {
                console.log('updating progress table');
                // Need to update database
                let now = new Date();
                connection.query('UPDATE ue_ztm_progress SET version = ?, level = ?, task = ?, subtask = ?, modified = ? WHERE userId = ?',
                        [latest.version, updatedProgress.level, updatedProgress.task, updatedProgress.subtask, now, account.id],
                        function (error, results, fields) {
                  if (error) {
                    progressReject(getBaseName(__filename)+" progress update database failure for email '" + account.email + "'");
                  } else {
                    updatedProgress.version = latest.version;
                    updatedProgress.modified = now;
                    progressResolve(updatedProgress);
                  }
                });
              } else {
                progressResolve(updatedProgress);
              }
            } else {
              progressReject('updateprogress Error query progress error. results.length');
            }
          }
        });
      });
      progressPromise.then(progress => {
        console.log('progressPromise.then progress='+JSON.stringify(progress));
        getUserObject(account.email, {account, progress}).then(userObject => {
          logSendOK(res, userObject, "updateprogress success for email '" + account.email + "'");
        }).catch(error => {
          logSendSE(res, error, 'updateprogress getUserObjectError');
        });
      }).catch(error => {
        logSendSE(res, error, 'updateprogress progressPromise error ');
      });
    }
  }
}

exports.revertprogress = function(req, res, next) {
  console.log('enter updateprogress');
  let userId = req.session.user && req.session.user.id;
  let account = JSON.parse(JSON.stringify(req.session.user));
  if (typeof userId !== 'number') {
    let msg = 'session userId not a number';
    logSendSE(res, msg, msg);
  } else {
    let updatedProgress = req.body;
    console.log('updatedProgress='+JSON.stringify(updatedProgress));
    if (updatedProgress.version !== latest.version) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'Tasks version number '+updatedProgress.version+' is out of date', {});
    } else if (!latest.levels[updatedProgress.level]) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'invalid level:'+updatedProgress.level, {});
    } else if (!latest.levels[updatedProgress.level].tasks[updatedProgress.task]) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'invalid task:'+updatedProgress.task, {});
    } else {
      let progressPromise = new Promise((progressResolve, progressReject) => {
        let now = new Date();
        connection.query('UPDATE ue_ztm_progress SET version = ?, level = ?, task = ?, subtask = ?, modified = ? WHERE userId = ?',
                [latest.version, updatedProgress.level, updatedProgress.task, updatedProgress.subtask, now, account.id],
                function (error, results, fields) {
          if (error) {
            progressReject(getBaseName(__filename)+" progress update database failure for email '" + account.email + "'");
          } else {
            updatedProgress.version = latest.version;
            updatedProgress.modified = now;
            progressResolve(updatedProgress);
          }
        });
      });
      progressPromise.then(progress => {
        console.log('progressPromise.then progress='+JSON.stringify(progress));
        getUserObject(account.email, {account, progress}).then(userObject => {
          logSendOK(res, userObject, "updateprogress success for email '" + account.email + "'");
        }).catch(error => {
          logSendSE(res, error, 'updateprogress getUserObjectError');
        });
      }).catch(error => {
        logSendSE(res, error, 'updateprogress progressPromise error ');
      });
    }
  }
}
