var express = require('express'),
  path = require('path'),
  bitcoinapi = require('bitcoin-node-api'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  settings = require('./lib/settings'),
  routes = require('./routes/index'),
  lib = require('./lib/explorer'),
  db = require('./lib/database'),
  locale = require('./lib/locale'),
  request = require('request');

var app = express();

// bitcoinapi
bitcoinapi.setWalletDetails(settings.wallet);
bitcoinapi.setAccess('only', [
  'getinfo',
  'getmininginfo',
  'getconnectioncount',
  'getblockcount',
  'getblockhash',
  'getblock',
  'getrawtransaction',
  'getpeerinfo',
  'gettxoutsetinfo',
  'getmemberinfo',
]);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, settings.favicon)));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api', bitcoinapi.app);
app.use('/', routes);
app.use('/ext/getmoneysupply', function(req,res){
  lib.get_supply(function(supply){
    res.send(' '+supply);
  });
});

app.use('/ext/getaddress/:hash', function(req,res){
  db.get_address(req.params.hash, function(address){
    if (address) {
      var a_ext = {
        address: address.a_id,
        sent: (address.sent / 100000000),
        received: (address.received / 100000000),
        balance: (address.balance / 100000000).toString().replace(/(^-+)/mg, ''),
        last_txs: address.txs,
      };
      res.send(a_ext);
    } else {
      res.send({ error: 'address not found.', hash: req.params.hash})
    }
  });
});

app.use('/ext/getbalance/:hash', function(req,res){
  db.get_address(req.params.hash, function(address){
    if (address) {
      res.send((address.balance / 100000000).toString().replace(/(^-+)/mg, ''));
    } else {
      res.send({ error: 'address not found.', hash: req.params.hash})
    }
  });
});

app.use('/ext/getdistribution', function(req,res){
  db.get_richlist(settings.coin, function(richlist){
    db.get_stats(settings.coin, function(stats){
      db.get_distribution(richlist, stats, function(dist){
        res.send(dist);
      });
    });
  });
});

app.use('/ext/getlasttxs/:min/:count', function(req,res){
  db.get_last_txs(req.params.count, (req.params.min * 100000000), function(txs){
    res.send({data: txs});
  });
});

app.use('/ext/getlasttxs/:min', function(req,res){
  db.get_last_txs(settings.index.last_txs, (req.params.min * 100000000), function(txs){
    res.send({data: txs});
  });
});

app.use('/ext/connections', function(req,res){
  db.get_peers(function(peers){
    res.send({data: peers});
  });
});

app.use('/ext/gettxcount', function(req,res){
  db.get_txcount(function(txcount){
    res.send(''+txcount);
  });
});

// locals
app.set('title', settings.title);
app.set('symbol', settings.symbol);
app.set('coin', settings.coin);
app.set('locale', locale);
app.set('display', settings.display);
app.set('snlinks', settings.snlinks);
app.set('bitcointalk', settings.bitcointalk);
app.set('discord', settings.discord);
app.set('facebook', settings.facebook);
app.set('github', settings.github);
app.set('github_explorer', settings.github_explorer);
app.set('medium', settings.medium);
app.set('reddit', settings.reddit);
app.set('telegram', settings.telegram);
app.set('twitter', settings.twitter);
app.set('website', settings.website);
app.set('youtube', settings.youtube);
app.set('genesis_block', settings.genesis_block);
app.set('index', settings.index);
app.set('txcount', settings.txcount);
app.set('show_sent_received', settings.show_sent_received);
app.set('logo', settings.logo);
app.set('theme', settings.theme);
app.set('labels', settings.labels);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
