const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const Product = require('./models/product');  // Assuming the model is in the models directory

const app = express();
require("dotenv").config()
const port = process.env.PORT || 3000 ;


console.log(process.env.MONGODB_URL)




// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL , {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));


// Multer setup for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Endpoint to upload a product
app.post('/products', upload.array('productImages', 5), async (req, res) => {
    try {
        const { name, description, price, sellerContact, sellerWhatsApp, brandName } = req.body;
        const productImages = req.files.map(file => file.path);

        const product = new Product({
            name,
            description,
            price,
            sellerContact,
            productImages,
            sellerWhatsApp,
            brandName
        });

        await product.save();
        res.status(201).json({ status: false, message: 'Product uploaded successfully', product });
    } catch (error) {
        res.status(500).json({ status : true,  message: 'Failed to upload product', error });
    }
});

// Endpoint to get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            status : true,
            products
        });
    } catch (error) {
        res.status(500).json({ status : true, message: 'Failed to retrieve products', error });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
