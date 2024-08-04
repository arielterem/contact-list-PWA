# Contact List Application

## Overview

This project is a Contact List Application built using Angular 17 for the client-side and Node.js with Express for the server-side. It utilizes MongoDB for data storage and can be built and run as a Progressive Web App (PWA).

## Design and UI

The application is designed with a **mobile-first UI approach** to ensure a seamless experience on mobile devices. All the design and styling are implemented using **CSS**, without relying on any external CSS frameworks. This approach allows for a lightweight and customizable user interface, tailored specifically to the application's needs.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (includes npm)
- [MongoDB](https://www.mongodb.com/try/download/community) (or a cloud-based MongoDB service like MongoDB Atlas)

## Setup and Installation

### Server

1. **Navigate to the server directory:**
   ```bash
   cd server

## Setup and Installation

### Server

1. **Navigate to the server directory:**
   ```bash
   cd server


2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the server:**
   ```bash
   npm run dev
   ```
   This command will start the server using `nodemon`. Ensure that `nodemon` is installed globally, or install it locally and use `npx` to run it.

4. **Configure MongoDB:**
   - Ensure MongoDB is running locally or configure your connection to MongoDB Atlas.
   - Update the connection URI in `server/index.js` or `.env` file if using environment variables.

### Client

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the client:**
   ```bash
   npm start
   ```
   This will start the Angular development server and open the client application in your default web browser.

## Building and Running as PWA

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Build the Angular application:**
   ```bash
   ng build --prod
   ```
   If not working, run this:
    ```bash
   ng build --configuration production
   ```

3. **Navigate to the browser directory:**
   ```bash
   cd dist/contact-list/browser
   ```

4. **Serve the built application:**
   ```bash
   npx serve -s . -l 9090
   ```
   This will serve the application from the `browser` directory on port 9090. You can view it as a Progressive Web App (PWA) by navigating to `http://localhost:9090` in your browser.

## Progressive Web App (PWA) Offline Mode

The application supports offline mode using Angular's PWA features. When offline, the application fetches data from IndexedDB instead of making network requests. This ensures that users can continue to use the application without an internet connection.

### IndexedDB Structure

#### Tables

1. **contacts:** Stores contact details.
   - `id`: Unique identifier for each contact.
   - `name`: Name of the contact.
   - `fullAddress`: Full address of the contact.
   - `email`: Email address of the contact.
   - `phone`: Phone number of the contact.
   - `cell`: Cell number of the contact.
   - `age`: Age of the contact.
   - `image`: Contact's image (if available).

2. **contact-changes:** Tracks changes to contacts for synchronization purposes.
   - `id`: Unique identifier for the change entry (same as the contact ID).
   - `operation`: Type of operation ('update', 'create', 'delete').
   - `contact`: The contact object associated with the change.

### Synchronization

The application uses IndexedDB to store contact changes locally. When online, these changes are synchronized with the server. Here's how synchronization is handled:

#### Local Changes

Whenever a contact is updated, created, or deleted, an entry is added to the `contact-changes` table in IndexedDB.

#### Sync Process

1. **On Application Start or Online Status:**
   - The app checks for any unsynchronized changes in the `contact-changes` table.
   - It sends these changes to the server to update the database.

2. **After Successful Synchronization:**
   - The local `contact-changes` table is cleared to remove synchronized entries.

This mechanism ensures that the application remains functional even without an internet connection and that all changes are seamlessly integrated when connectivity is restored.


## API Endpoints

### GET /contacts

- **Description:** Retrieve all contacts sorted alphabetically.
- **Response:** An array of contact objects.

### GET /contacts/:id

- **Description:** Retrieve a single contact by ID.
- **Params:** `id` - The ID of the contact to retrieve.
- **Response:** A contact object.

### POST /contacts

- **Description:** Create a new contact.
- **Body:**
  - `name`: (String) Contact's name.
  - `fullAddress`: (String) Contact's full address.
  - `email`: (String) Contact's email address.
  - `phone`: (String) Contact's phone number.
  - `cell`: (String) Contact's cell number.
  - `age`: (Number) Contact's age.
  - `image`: (File, optional) The contact's image file.
  - `imageType`: (String, optional) Type of the image (e.g., `image/jpeg`).
- **Response:** The newly created contact object.

### PUT /contacts/:id

- **Description:** Update an existing contact.
- **Params:** `id` - The ID of the contact to update.
- **Body:**
  - `name`: (String) Contact's name.
  - `fullAddress`: (String) Contact's full address.
  - `email`: (String) Contact's email address.
  - `phone`: (String) Contact's phone number.
  - `cell`: (String) Contact's cell number.
  - `age`: (Number) Contact's age.
  - `image`: (File, optional) The contact's image file. If not provided or is empty, the image field will be set to `null`.
  - `imageType`: (String, optional) Type of the image (e.g., `image/jpeg`). Defaults to an empty string if not provided.
- **Response:** The updated contact object.

### DELETE /contacts/:id

- **Description:** Remove a contact.
- **Params:** `id` - The ID of the contact to delete.
- **Response:** Success or failure message.

### POST /contacts/10Contacts

- **Description:** Create 10 random contacts.
- **Source:**  https://randomuser.me/api/
- **Body:** Empty.
- **Response:** An array of 10 newly created contact objects.


## Troubleshooting

- If you encounter issues with missing modules, ensure all dependencies are installed by running `npm install` in both the server and client directories.
- Ensure MongoDB is running and properly configured in your environment.
- Check the console for detailed error messages and logs.

## Contributing

Feel free to share if you have suggestions or improvements.

## License

**This project was created by [Ariel Terem](https://github.com/arielterem). All rights reserved. ©**
**github.com/arielterem**

```

This `README.md` file provides detailed instructions on setting up and running both the server and client, including how to build and serve the Angular application as a PWA. It also includes troubleshooting tips and information on API endpoints.