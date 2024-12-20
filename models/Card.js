

const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    column: { type: String, required: true },
    id: { type: String, required: true } // Make sure `id` is a unique identifier
});

const CardModel = mongoose.model("Card", CardSchema);

module.exports = CardModel;
