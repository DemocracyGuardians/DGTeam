
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

let incrementUsingParticularVersion = ((params, tasks) => {
  return new Promise((resolve, reject) => {
    console.log('incrementUsingParticularVersion params='+JSON.stringify(params));
    let { level, task, subtask } = params;
    let { version } = tasks;
    let currentLevel = tasks.levels[level];
    if (!currentLevel || !currentLevel.tasks) {
      reject('taskRoutes incrementUsingParticularVersion level '+level+' does not exist for tasks version '+version);
      return
    }
    let currentTask = currentLevel.tasks[task];
    if (!currentTask) {
      reject('taskRoutes incrementUsingParticularVersion  task '+task+' does not exist for level '+level+' and tasks version '+version);
      return
    }
    console.log('currentTask.type='+currentTask.type);
    if (currentTask.type === 'Lesson') {
      readlesson(level, currentTask.name).then(lesson => {
        console.log('typeof lesson='+typeof lesson);
        if (!lesson || !lesson.screens || !lesson.screens.length) {
          reject('taskRoutes invalid lesson level='+level+', name='+currentTask.name)
        } else {
          let nScreens = lesson.screens.length;
          let nTasks = currentLevel.task.length;
          console.log('nScreens='+nScreens+', nTasks='+nTasks);
          if (subtask < nScreens-1) {
            subtask++
          } else if (task < nTasks-1) {
            task++;
            subtask = 0;
          } else {
            level++;
            task = 0;
            subtask = 0;
          }
          resolve({ version, level, task, subtask })
        }
      }).catch(error => {
        reject(error)
      })
    } else {
      reject('taskRoutes incrementUsingParticularVersion unsupported task type '+currentTask.type+' for task '+task+' , level '+level+' and tasks version '+version);
    }
  });
});

exports.incrementprogress = function(req, res, next) {
  console.log("incrementprogress req", req.body);
  console.log('req.session.id='+req.session.id);
  console.log('req.path='+req.path);
  console.dir(req.body);
  let userId = req.session.user && req.session.user.id;
  let account = JSON.parse(JSON.stringify(req.session.user));
  console.log('typeof userId='+typeof userId);
  console.log('userId='+userId);
  if (typeof userId !== 'number') {
    let msg = 'session userId not a number';
    logSendSE(res, msg, msg);
  } else {
    let currentSessionProgress = req.body;
    console.log('currentSessionProgress='+JSON.stringify(currentSessionProgress));
    if (currentSessionProgress.version !== latest.version) {
      logSendCE(res, 400, UNSPECIFIED_SYSTEM_ERROR, 'Task version number '+currentSessionProgress.version+' is out of date', {});
    } else {
      incrementUsingParticularVersion(currentSessionProgress, latest).then(updatedProgress => {
        console.log('updatedProgress='+JSON.stringify(updatedProgress));
        let progressPromise = new Promise((progressResolve, progressReject) => {
          connection.query('SELECT * FROM ue_ztm_progress WHERE userId = ?', [account.id], function (error, results, fields) {
            if (error) {
              progressReject("incrementprogress database failure for query progress for email '" + account.email + "'");
            } else {
              if (results.length === 1) {
                let oldProgress = results[0];
                console.log('oldProgress='+JSON.stringify(oldProgress));
                let { level, task, subtask } = oldProgress;
                if (updatedProgress.level > level ||
                    (updatedProgress.level === level && updatedProgress.task > task) ||
                    (updatedProgress.level === level && updatedProgress.task === task && updatedProgress.subtask > subtask)) {
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
                progressReject('incrementprogress Error query progress error. results.length');
              }
            }
          });
        });
        progressPromise.then(progress => {
          console.log('progressPromise.then progress='+JSON.stringify(progress));
          getUserObject(account.email, {account, progress}).then(userObject => {
            logSendOK(res, userObject, "incrementprogress success for email '" + account.email + "'");
          }).catch(error => {
            logSendSE(res, error, 'incrementprogress getUserObjectError');
          });
        }).catch(error => {
          logSendSE(res, error, 'incrementprogress progressPromise error ');
        });
      }).catch(error => {
        logSendSE(res, error, "incrementprogress incrementUsingParticularVersion error");
      });
    }
  }
}
