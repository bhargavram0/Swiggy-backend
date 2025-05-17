const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const venderRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes')
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const path = require('path');

const app = express();


const PORT = process.env.PORT || 4000;
dotenv.config();

app.use(cors())


mongoose.connect(process.env.MONGO_URI)
    .then(() =>{
        console.log('MongoDB connected successfully!');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
    })

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use('/vendor', venderRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static("uploads"));



app.use('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});