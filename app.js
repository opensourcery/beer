/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};

/**
 * Configure API access.
 */
var passport = require('passport'),
    BearerStrategy = require('passport-http-bearer').Strategy,
    apiSecret = require('./config/api.js');

function findByToken(token, fn) {
  for (var i = 0, len = apiSecret.users.length; i < len; i++) {
    var user = apiSecret.users[i];
    if (user.token === token) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

passport.use(new BearerStrategy({},
  function(token, done) {
    findByToken(token, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'read' });
    });
  }
));

app.configure(function () {
  app.use(passport.initialize());
  app.use(app.router);
});

/**
 * Routes
 */

// Serve index.
app.get('/', routes.index);

// API requests.
app.post('/api',
  passport.authenticate('bearer', {session: false})
, api.environment);

// Provide something for GET requests.
app.get('/api', api.landingPage);

// Redirect all others to the index (HTML5 history).
app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', require('./routes/socket'));

/**
 * Start Server
 */
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
