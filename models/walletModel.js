const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  transactions: [
    {
      type: {
        type: String, 
        enum: ['debit', 'credit'],
        required: true,
      },
      amount: {
        type: Number,
        required:true
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  balance:{
    type:Number,
    default:0
  }
});

module.exports  = mongoose.model('Wallet', walletSchema);


