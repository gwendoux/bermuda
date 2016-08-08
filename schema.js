const mongoose   = require('mongoose');
const Schema     = mongoose.Schema;

const redirSchema = new Schema({
    shortUrl: String,
    url: String,
    createdAt: Date
});

const Redir = mongoose.model('Redir', redirSchema);

module.exports = Redir;
