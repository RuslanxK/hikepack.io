const mongoose = require('mongoose');

const bagSchema = new mongoose.Schema({
    
    tripId: String,
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    goal: { type: String, min: '0' },
    passed: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    exploreBags: {type: Boolean, default: false},
    imageUrl: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
      }

},  { timestamps: true });

module.exports = mongoose.model('bags', bagSchema);