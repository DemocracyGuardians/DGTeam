
var fs = require('fs');
var _eval = require('eval');

module.exports = ((level, name) => {
  return new Promise((resolve, reject) => {
    let taskPath = './Tasks/'+level+'/'+name+'.js';
    console.log('taskPath='+taskPath);
    let task = { success: false };
    fs.readFile(taskPath, 'utf8', function (err, data) {
      if (err) {
        reject('unable to load module='+taskPath);
      } else {
        var task = _eval(data);
        task.success = true;
        //console.dir(task);
        resolve(task);
      }
    });
  });
});
