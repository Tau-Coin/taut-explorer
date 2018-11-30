#!/usr/bin/env nodejs
var debug = require('debug')('explorer');
var settings = require('../lib/settings');
var db = require('../lib/database');
var app = require('../app'); 

app.set('port', process.env.PORT || settings.port);

var dbString = 'mongodb://' + settings.dbsettings.user;
dbString = dbString + ':' + settings.dbsettings.password;
dbString = dbString + '@' + settings.dbsettings.address;
dbString = dbString + ':' + settings.dbsettings.port;
dbString = dbString + '/' + settings.dbsettings.database;

db.connect(dbString, function() {
  db.check_stats(settings.coin, function(exists) {
    if (exists == false) {
      console.log('No stats entry found, creating now..');
      db.create_stats(settings.coin, function(){
        //console.log('stats entry created successfully.');
      });
    } else {
      db.get_stats(settings.coin, function (stats) {
        app.locals.stats = stats;
      });
    }
  });
  
  db.check_richlist(settings.coin, function(exists){
    if (exists == false) {
      console.log('no richlist entry found, creating now..');
      db.create_richlist(settings.coin, function() {

      });
    }
  });  

  var server = app.listen(app.get('port'), '::', function() {
    debug('Express server listening on port ' + server.address().port);
  });
});
