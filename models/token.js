const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const TokenSchema = new Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Usuario"},
    token: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now, expires: 3600}
})

module.exports = mongoose.model("Token", TokenSchema);