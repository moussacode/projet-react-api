const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['mouton', 'vache', 'chèvre']
  },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: String,
  image: {
    type: String, // Stockera le Base64
    required: true
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available'
  },
  createdAt: { type: Date, default: Date.now }
});
const Animal = mongoose.model('Animal', animalSchema);
module.exports = Animal