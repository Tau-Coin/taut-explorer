var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
 
var StatsSchema = new Schema({
  coin: { type: String },
  blockcount: { type: Number, default: 1 },
  lastblock: { type: Number, default: 1 },
  supply: { type: Number, default: 0 },
  connections: { type: Number, default: 0 },
  txcount: { type: Number, default: 1 },
});

module.exports = mongoose.model('CoinStats', StatsSchema);
