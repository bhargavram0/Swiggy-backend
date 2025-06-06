const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor')
const multer = require('multer');
const path = require('path');
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const cloudinary = require('cloudinary').v2;


// cloudinary.config({
//   cloud_name: 'YOUR_CLOUD_NAME',
//   api_key: 'YOUR_API_KEY',
//   api_secret: 'YOUR_API_SECRET'
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'firms',
//     allowed_formats: ['jpg', 'jpeg', 'png'],
//   },
// });

// const upload = multer({ storage: storage });

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });



const addFirm = async(req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        
        const image = req.file? req.file.filename : undefined; 
        
        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            res.status(404).json({ message: 'Vendor not found' });
        }

        if(vendor.firm.length > 0){
            return res.status(400).json({ message: 'vendor can have one firm' });
        }

        const firm = new Firm({
             firmName,
             area,
             category,
             region,
             offer,
             image,
             vendor: vendor._id, 
            });
            const savedFirm = await firm.save();
            
            const firmId = savedFirm._id;
            const vendorFirmName = savedFirm.firmName;

            vendor.firm.push(savedFirm);

            await vendor.save();

            return res.status(200).json({ message: 'Firm added successfully', firmId, vendorFirmName });



    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server error' });
    } 
}

const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId;

        const deletedProduct = await Firm.findByIdAndDelete(firmId);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'No Firm found' });
        }
        res.status(200).json({ message: 'Firm deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { addFirm: [upload.single('image'), addFirm], deleteFirmById};