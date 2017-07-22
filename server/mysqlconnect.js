var mysql = require('mysql');

module.exports = function() {

  return new Promise(function(resolve, reject) {

    // FIXME get values from env vars
    var con = mysql.createConnection({
      host: "localhost",
      user: "tdamysqlwp",
      password: "ue3466428#"
    });

    con.connect(function(err) {
      if (err) return reject(err);
      console.log("mysql connected.");
      resolve(con);
    });

  });

};
