const mongoose = require ('mongoose');

const serverSchema = new mongoose.Schema ({
  createDate: String,
  removeDate: String,
  // usageTime: String,
  status: false
});

module.exports = mongoose.model ('lists', serverSchema);
