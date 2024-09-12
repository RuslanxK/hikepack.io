const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    tripId: String,
    bagId: String,
    name: { type: String, trim: true },
    order: {type: Number, default: null, index: true},
    color: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
      }
})


module.exports = mongoose.model('categories', categorySchema);


