const Vendor = require('../models/Vendor'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({
            username,
            email,
            password: hashPassword,
        });
        await newVendor.save();
        res.status(201).json({ message: 'Vendor registered successfully' });
        console.log('registered successfully');
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' });
    }
};


const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
try {
    const vendor = await Vendor.findOne({ email });

    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ vendorId: vendor._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const vendorId = vendor._id;


    res.status(200).json({ success: 'Login successful',token, vendorId });
    // console.log(email, token)
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
}
}

const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
}

const getVendorById = async (req, res) => {
    const vendorId = req.params.id;
    console.log(vendorId)
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }
        const vendorFirmId = vendor.firm[0]._id;
        res.status(200).json({vendorId,vendorFirmId, vendor});
        console.log(vendorFirmId)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server error' });
    }
}

module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };

