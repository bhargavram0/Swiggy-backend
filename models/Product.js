const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: [{
                type: String,
                enum: ['veg', 'non-veg']
            }]
    },
    image: {
        type: String,
    },
    bestseller: {
        type: Boolean,
    
    },
    description: {
        type: String,

    },
    firm: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm'
    }]
});

module.exports = mongoose.model('Product', productSchema);