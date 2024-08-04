const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name: String,
    fullAddress: String,
    email: String,
    phone: String,
    cell: String,
    registrationDate: Date,
    age: Number,
    image: Buffer,
    imageType: String
});

module.exports = mongoose.model('contacts', contactSchema);
