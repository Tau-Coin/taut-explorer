/**
* The Settings Module reads the settings out of settings.json and provides
* this information to the other modules
*/

var fs = require("fs");
var jsonminify = require("jsonminify");


// The app title, visible e.g. in the browser window
exports.title = "TAU Explorer";

// The url it will be accessed from
// exports.address = "127.0.0.1:3000";
exports.address = "block.taucoin.io";

// Logo
exports.logo = "/images/logo-tau.png";

// The app favicon fully specified url, visible e.g. in the browser window
exports.favicon = "public/favicon.ico";

// Theme
exports.theme = "tau";

// The Port ep-lite should listen to
exports.port = process.env.PORT || 3001;

// Coin symbol, visible e.g. TAU, BTC, LTC
exports.symbol = "TAU";

// Coin name, visible e.g. in the browser window
exports.coin = "TAU";


// This setting is passed to MongoDB to set up the database
exports.dbsettings = {
  "user": "user",
  "password": "pwd",
  "database": "tauexplorerdb",
  "address" : "localhost",
  "port" : 27017
};

// This setting is passed to the wallet
exports.wallet = { 
  "host" : "127.0.0.1",
  "port" : 8778,
  "user" : "TAUrpc",
  "pass" : "password"
};

// Locale file
exports.locale = "locale/en.json";

// Menu items to display
exports.display = {
  "api": true,
  "movement": true,
  "network": true,
  "richlist": true,
  "search": true
};

// Social networks links to display
exports.snlinks = {
  "bitcointalk": true,
  "discord": true,
  "facebook": true,
  "github": true,
  "medium": true,
  "reddit": true,
  "telegram": true,
  "twitter": true,
  "website": true,
  "youtube": true
};


// API page settings
exports.api = {
  "blockindex": 1337,
  "blockhash": "46329654e5362e0f3728a0fbcee20d49a2ec36b0fe5ed5c8c14c68a0c5f588a0",
  "txhash": "bf48be918b9056b15662a5da5b3a897de31e54a10ba9ea06035b4dfa926a86e6",
  "address": "TGwH9btZVNtP7HqLyULt2e8EmFkqfJJCbZ"
};

// Richlist/top100 page settings
exports.richlist = {
  "distribution": true,
  "received": true,
  "balance": true
};

// Movement page settings
exports.movement = {
  "min_amount": 100,
  "low_flag": 1000,
  "high_flag": 10000
};

// Network page settings
exports.network = {
  "ipstack_api_key": "Get-Your-Own-Key"
};

// Index page settings
exports.index = {
  "last_txs": 100
};

// Social networks and website

exports.bitcointalk = "4757879"; // https://bitcointalk.org/index.php?topic=XXXX
exports.discord = "ydhx3um"; // https://discord.gg/XXXX
exports.facebook = "taublockchain"; // https://www.facebook.com/XXXX
exports.github = "Tau-Coin"; // https://github.com/XXXX
exports.github_explorer = "Tau-Coin/tau-explorer"; // https://github.com/XXXX
exports.medium = "@taucoin"; // https://medium.com/XXXX
exports.reddit = "Tau_coin"; // https://www.reddit.com/r/XXXX
exports.telegram = "taucoin"; // https://t.me/XXXX
exports.twitter = "tau_io"; // https://twitter.com/XXXX
exports.website = "https://taucoin.io";
exports.youtube = "UC-6Nnlsl-9ANI7HezV1UzBQ"; // https://www.youtube.com/channel/XXXX

// Cnfirmations
exports.confirmations = 6;

// Timeouts
exports.update_timeout = 125;
exports.check_timeout = 250;


// Genesis
exports.genesis_tx = "a9da8df30aa8c4d26d9ca33568a5235b193d65446297cdded39058cbee51d36b";
exports.genesis_block = "d70fd9d81b708fe4e592755cfb9abcecec23d6d64eed06b9c9446a849b5bce94";


// Amount of txs to index per address (stores latest n txs)
exports.txcount = 100;

// Show total sent & received on address page (set false if PoS)
exports.show_sent_received = false;

// Current coin supply calculation
// BALANCES : total of all address balances
// TXOUTSET : retreive from gettxoutsetinfo api call
exports.supply = "TXOUTSET";

exports.labels = {};

exports.reloadSettings = function reloadSettings() {
  // Discover where the settings file lives
  var settingsFilename = "settings.json";
  settingsFilename = "./" + settingsFilename;

  var settingsStr;
  try{
    //read the settings sync
    settingsStr = fs.readFileSync(settingsFilename).toString();
  } catch(e){
    console.warn('No settings file found. Continuing using defaults!');
  }

  // try to parse the settings
  var settings;
  try {
    if(settingsStr) {
      settingsStr = jsonminify(settingsStr).replace(",]","]").replace(",}","}");
      settings = JSON.parse(settingsStr);
    }
  }catch(e){
    console.error('There was an error processing your settings.json file: '+e.message);
    process.exit(1);
  }

  //loop trough the settings
  for(var i in settings)
  {
    //test if the setting start with a low character
    if(i.charAt(0).search("[a-z]") !== 0)
    {
      console.warn("Settings should start with a low character: '" + i + "'");
    }

    //we know this setting, so we overwrite it
    if(exports[i] !== undefined)
    {
      exports[i] = settings[i];
    }
    //this setting is unkown, output a warning and throw it away
    else
    {
      console.warn("Unknown Setting: '" + i + "'. This setting doesn't exist or it was removed");
    }
  }

};

// initially load settings
exports.reloadSettings();
