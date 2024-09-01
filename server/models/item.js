const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  
    tripId: String,
    bagId: String,
    categoryId: String,
    name: { type: String, trim: true},
    qty: { type: Number, min: 1 },
    description: { type: String, trim: true },
    weightOption: {type: String, default: null },
    weight: { type: Number, min: 0.1 },
    priority: { type: String, trim: true, default: "low" },
    link: String,
    worn: {type: Boolean, default: false},
    imageUrl: { type: String, default: null },
    order: {type: Number, default: null},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
      }
   
}, { timestamps: true })


module.exports = mongoose.model('items', itemSchema);



