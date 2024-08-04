const express = require('express');
const multer = require('multer');
const axios = require('axios');
const Contacts = require('../models/contacts');
const router = express.Router();

// Setup multer to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });


// GET: Retrieve all contacts sorted alphabetically by name
router.get('/', async (req, res) => {
    try {
        // Fetch all contacts and sort by name in ascending order (case-insensitive)
        const contacts = await Contacts.find()
            .collation({ locale: 'en', strength: 2 }) // Case-insensitive sorting
            .sort({ name: 1 }) // Ascending order
            .exec();
        res.status(200).json(contacts);
    } catch (err) {
        console.error('Error retrieving contacts:', err);
        res.status(500).json({ message: 'Error retrieving contacts', error: err });
    }
});



// GET: Retrieve a specific contact by ID
router.get('/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await Contacts.findById(contactId);

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        res.status(200).json(contact);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving contact', error: err });
    }
});


// POST: Create a new contact
router.post('/', upload.single('image'), (req, res) => {
    console.log('im here');
    try {
        const { name, fullAddress, email, phone, cell, registrationDate, age, imageType } = req.body;
        const image = req.file ? req.file.buffer : null;
        const newContact = new Contacts({
            name,
            fullAddress,
            email,
            phone,
            cell,
            registrationDate,
            age,
            image,
            imageType
        });
        console.log('this is the new contact : ', newContact);
        
        newContact.save()
            .then(savedContact => {
                // Return the newly created contact
                res.status(201).json(savedContact);
            })
            .catch(err => res.status(500).json({ message: 'Error saving contact', error: err.message }));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});




// PUT: Update a contact
router.put('/:id', upload.single('image'), (req, res) => {
    try {
        const { id } = req.params;
        const { name, fullAddress, email, phone, cell, age, imageType } = req.body;
        
        // Determine if an image was provided
        let image = req.file ? req.file.buffer : null;

        // If image is null or undefined, set it explicitly to null
        if (!image) {
            image = null;
        }

        const updateData = {
            name,
            fullAddress,
            email,
            phone,
            cell,
            age,
            image: image || null, // Explicitly set image to null if not provided
            imageType: imageType || '' // Update imageType, default to empty string if not provided
        };

        Contacts.findByIdAndUpdate(id, updateData, { new: true }) // { new: true } to return the updated document
            .then(updatedContact => {
                if (updatedContact) {
                    res.status(200).json(updatedContact); // Return the updated contact
                } else {
                    res.status(404).json({ message: 'Contact not found' }); // Handle case where contact is not found
                }
            })
            .catch(err => res.status(500).json({ message: 'Error updating contact', error: err.message }));
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});





// DELETE: Delete a contact
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Attempt to delete the contact by ID
        const result = await Contacts.findByIdAndDelete(id);

        if (result) {
            // Contact was found and deleted
            res.status(200).json({ message: 'Contact deleted successfully!' });
        } else {
            // Contact not found
            res.status(404).json({ message: 'Contact not found' });
        }
    } catch (err) {
        // Handle server errors
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});



// Helper function to fetch an image as a buffer
async function fetchImageAsBuffer(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        return response.data;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

// POST: Create 10 new contacts
router.post('/10Contacts', async (req, res) => {
    try {
        // Fetch 10 random users from the Random User Generator API
        const response = await axios.get('https://randomuser.me/api/?results=10');
        const users = response.data.results;

        // Process and save each user
        const contactsPromises = users.map(async (user) => {
            // Fetch image as a buffer
            const imageBuffer = await fetchImageAsBuffer(user.picture.large);
            if (!imageBuffer) return null;

            // Create a new contact
            const newContact = new Contacts({
                name: `${user.name.first} ${user.name.last}`,
                fullAddress: `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}`,
                email: user.email,
                phone: formatPhoneNumber(user.phone),
                cell: formatPhoneNumber(user.cell),
                registrationDate: new Date(), // Current date
                age: user.dob.age,
                image: imageBuffer, // Image data as Buffer
                imageType: 'image/jpeg', // Assuming the image type from the URL
            });

            // Save the new contact to the database
            return newContact.save();
        });

        // Wait for all contacts to be saved and filter out nulls
        const savedContacts = await Promise.all(contactsPromises);
        const successfullySavedContacts = savedContacts.filter(contact => contact !== null);

        // Sort contacts by name in alphabetical order
        successfullySavedContacts.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

        if (successfullySavedContacts.length === 0) {
            return res.status(500).json({ message: 'No contacts were created due to errors.' });
        }

        // Return the saved contacts to the client
        res.status(201).json(successfullySavedContacts);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


// Function to format phone numbers to numbers only
function formatPhoneNumber(phone) {
    return phone.replace(/\D/g, '');
}


module.exports = router;
