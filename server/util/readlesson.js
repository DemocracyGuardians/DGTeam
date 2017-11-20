
var fs = require('fs');
var _eval = require('eval');

module.exports = ((level, name) => {
  return new Promise((resolve, reject) => {
    let lessonPath = './Lessons/'+level+'/'+name+'.js';
    console.log('lessonPath='+lessonPath);
    let lesson = { success: false };
    fs.readFile(lessonPath, 'utf8', function (err, data) {
      if (err) {
        reject('unable to load module='+lessonPath);
      } else {
        var lesson = _eval(data);
        lesson.success = true;
        //console.dir(lesson);
        resolve(lesson);
      }
    });
  });
});
