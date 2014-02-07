/**
 * Module dependencies
 */

var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var UntappdClient = require('node-untappd/UntappdClient');

/**
 * Configuration
 */
var untappdConfig = require ('./config/secret');
var beerIds = require ('./config/beers');

/**
 * Init Untappd.
 */
var untappd = new UntappdClient(untappdConfig.debug);

untappd.setClientId(untappdConfig.clientId);
untappd.setClientSecret(untappdConfig.clientSecret);

/**
 * Redis cache.
 */
var redis = require('redis');
var cache = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

/**
 * Init the beers.
 */
var beers = require('./lib/beers')(cache, untappd, beerIds);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
};


/**
 * Routes
 */

// serve index and view partials
app.get('/', routes.index);
//app.get('/partials/:name', routes.partials);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', require('./routes/socket'));

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
