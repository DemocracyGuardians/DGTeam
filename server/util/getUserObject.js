
const dbconnection = require('./dbconnection')

var connection = dbconnection.getConnection();

/**
 * Queries the database for latest info on current user.
 * Returns a user object containing the info.
 * The calling routine might have partial info on hand already.
 *
 * @param {string} email  Email for current user
 * @param {object} alreadyHave The parts of the user object that the calling
 *        routine already has on hand. For example, if the calling routine already
 *        has the account info, it passes in {account:{...}}.
 *        If the calling routine has no info on hand, pass in undefined, null or {}
 * @return {Promise} payload is userObject
 */
module.exports = function(email, alreadyHave) {
  return new Promise((masterResolve, masterReject) => {
    let userObject = alreadyHave ? JSON.parse(JSON.stringify(alreadyHave)) : {};
    if (userObject.account) {
      delete userObject.account.password
      masterResolve(userObject);
    } else {
      let accountPromise = new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM ue_ztm_account WHERE email = ?', [email], function (error, results, fields) {
          if (error) {
            reject("getUserObject select account failure for email '" + email + "'. error="+error);
          } else {
            let msg = "getUserObject select account success for email '" + email + "'";
            console.log(msg + ", results= ", JSON.stringify(results));
            if (results.length !== 1) {
              reject("getUserObject select account failure for email '" + email + "'. results.length="+results.length);
            } else {
              let account = results[0];
              delete account.password;
              resolve(account);
            }
          }
        });
      });
      accountPromise.then(account => {
        userObject.account = account;
        masterResolve(userObject);
      }).catch(error => {
        masterReject(error);
      });
    }
  });
};
