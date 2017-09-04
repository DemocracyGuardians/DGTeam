
var express = require("express");
var sessionRoutes = require('./routes/sessionRoutes');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) { // allow CORS
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

var apiRouter = express.Router();
apiRouter.post('/login', sessionRoutes.login)
apiRouter.post('/loginexists', sessionRoutes.loginexists)
apiRouter.post('/signup', sessionRoutes.signup);
apiRouter.get('/verifyaccount/:token', sessionRoutes.verifyAccount);
app.use('/api', apiRouter);
app.listen(3001);
