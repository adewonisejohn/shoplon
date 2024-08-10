const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    sellerContact: { type: String, required: true },
    productImages: [{ type: String }],  // Array of image URLs or file paths
    sellerWhatsApp: { type: String, required: true },
    brandName: { type: String, required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
