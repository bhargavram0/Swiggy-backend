const Product = require('../models/Product');
const multer = require('multer');
const Firm = require('../models/Firm');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });


const addProduct = async(req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body;
        
        const image = req.file ? req.file.filename : undefined; 

        // if (!productName || !price || !description || !category || !image) {
        //     return res.status(400).json({ message: 'All fields are required' });
        // }


        const firmId = req.params.firmId; 
        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ error: 'Firm not found' });
        }

        const product = new Product({
            productName,
            price,
            category,
            bestSeller: bestSeller === 'true',
            description,
            image,
            firm: firm._id
        });
        const savedProduct = await product.save();

        firm.product.push(savedProduct); 

        await firm.save();

        res.status(200).json(savedProduct); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
}


const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId; 
        const firm = await Firm.findById(firmId)

        if (!firm) {
            return res.status(404).json({ message: 'Firm not found' });
        }

        const restaurantName = firm.firmName;
        const products = await Product.find({ firm: firmId });

        res.status(200).json({restaurantName, products}); 

    } catch (error) {
        console.error(error);
        res.status(500).json({ message : 'Internal Server error' });
    }
}

const deletedProductById = async(req, res)=>{

    try {
        const productId = req.params.productId;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'No product found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { addProduct: [upload.single('image'), addProduct], getProductByFirm, deletedProductById };