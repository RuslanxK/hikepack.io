const mongoose = require('mongoose');


const tripSchema = new mongoose.Schema({
    
    name: { type: String, trim: true },
    about: { type: String, trim: true },
    distance: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    imageUrl: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
      }
   

},  { timestamps: true });



module.exports = mongoose.model('trips', tripSchema);