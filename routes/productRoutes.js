const express = require('express');
const productsController = require('../controllers/productController')

const router = express.Router();

router.post('/add-product/:firmId', productsController.addProduct);
router.get('/:firmId/products', productsController.getProductByFirm);


router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.header('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
})

router.delete('/:productId', productsController.deletedProductById);

module.exports = router;