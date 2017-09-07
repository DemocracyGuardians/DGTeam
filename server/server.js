
var envvars = require('./util/envvars');
envvars.check(); // exits if any env vars not set
var TEAM_API_RELATIVE_PATH = process.env.TEAM_API_RELATIVE_PATH;
var TEAM_API_PORT = process.env.TEAM_API_PORT;

var express = require("express");
var sessionRoutes = require('./routes/sessionRoutes');
var bodyParser = require('body-parser');

var app = express();
app.use(function(req, res, next) {
  console.log('req.path='+req.path)
  next()
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) { // allow CORS
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

var apiRouter = express.Router();
apiRouter.post('/signup', sessionRoutes.signup);
apiRouter.post('/login', sessionRoutes.login)
apiRouter.post('/loginexists', sessionRoutes.loginexists)
apiRouter.post('/resendverification', sessionRoutes.resendVerificationEmail)
apiRouter.get('/verifyaccount/:token', sessionRoutes.verifyAccount);
app.use(TEAM_API_RELATIVE_PATH, apiRouter);

app.listen(TEAM_API_PORT);
