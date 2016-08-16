const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const redirSchema = new Schema({
    slug: String,
    shortUrl: String,
    url: String,
    createdAt: Date,
    click: [
        {date: Date}
    ]
});

const Redir = mongoose.model('Redir', redirSchema);

module.exports = Redir;
