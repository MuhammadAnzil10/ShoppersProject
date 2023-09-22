const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({

    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    addresses:[{

    user_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true,

    },

    name: {
    type: String,
    required: true,
    },

    phone: {
        type: String,
        required: true,
    },

    addressLine1: {
        type: String,
        required: true,
    },

    addressLine2: {
        type: String,
    },

    postCode: {
        type: String,
    },

    area: {
        type: String,
    },

    country: {
        type: String,
        required: true,
    },

    state: {
        type: String,
    },
    isDefault: {
        type: Boolean,
        default: false,
      }
}
]
},{timestamps:true});



module.exports =  mongoose.model('Address', addressSchema);
