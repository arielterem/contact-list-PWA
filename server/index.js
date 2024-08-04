const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const ContactsRoute = require('./routes/contactsRoute');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);


const DBurl = 'mongodb://127.0.0.1:27017/contact-list';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// Use the contacts route
app.use('/contacts', ContactsRoute);

const startServer = async () => {
    try {
        // Connect to MongoDB without deprecated options
        await mongoose.connect(DBurl);
        console.log('DB is connected');

        // Start the server
        const server = httpServer.listen(8080, () => {
            const port = server.address().port;
            console.log('Server is listening on port ' + port);
        });
    } catch (err) {
        console.error('Error connecting to the database', err);
    }
};

startServer();
