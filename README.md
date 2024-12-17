# Project Overview

This project is a **Content Management System** for signage displays built with **Next.js**, **Fabric.js**, **Cloudinary**, **MongoDB**, and **Electron**. The application supports real-time collaboration using WebSockets, offline functionalities, and cloud-based image uploads for efficient content management.

---

## Technologies Used

1. **Next.js**: Framework for React with built-in SSR (Server-Side Rendering) and API routes.
2. **Fabric.js**: Canvas library for managing and manipulating visual elements.
3. **Cloudinary**: Cloud storage for image uploads and hosting.
4. **WebSockets**: Real-time server communication for live updates.
5. **Electron**: Desktop application wrapper for offline features.
6. **MongoDB**: Database for storing canvas JSON data and metadata.
7. **Vercel**: Deployment platform for the Next.js application.

---

## Deployed Link

The web app is deployed on Vercel:
[https://signage-content-web-app.vercel.app/](https://signage-content-web-app.vercel.app/)

---

## Application Pages

### **1. Home Page** (`/`)

- Build a new canvas using **Fabric.js**.
- Add basic shapes, text, and images to the canvas.
- Save the canvas to the database.

---

### **2. Menu Page** (`/menu`)

- Displays the list of existing canvases.
- Features:
  - **Edit**: Open a canvas for editing.
  - **Delete**: Remove a canvas.
  - **Post**: Publish a draft canvas.

---

### **3. Editing Canvas Page** (`/canvas/[name]`)

- Renders an existing canvas for editing.
- Features:
  - Modify shapes, text, and images.
  - Save changes back to the database.

---

## Setup Instructions

### 1. Local Development Environment

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install Dependencies**:
   Ensure Node.js is installed (version 16+ recommended).

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env.local` file in the root directory:

   ```
   MONGODB_URI=<Your MongoDB Connection String>
   CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
   CLOUDINARY_API_KEY=<Your Cloudinary API Key>
   CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>
   ```

4. **Run the Next.js App**:
   Start the development server for offline features:
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

### 2. Running the WebSocket Server

1. Ensure you have Node.js installed.
2. Run the WebSocket server script:
   ```bash
   node ws-server.js
   ```
   By default, the WebSocket server listens on port `8080`. Make sure the port is open and available.

---

### 3. Running the Electron App

1. **Install Electron**:
   Ensure Electron is installed globally:

   ```bash
   npm install -g electron
   ```

2. **Build and Run the Electron App**:
   ```bash
   npm run electron
   ```
   This command runs the Electron app locally, providing offline support for managing signage content.

---

### 4. Running Offline Features

To enable offline functionalities:

- The Electron app acts as a wrapper for the Next.js application.
- Canvas data can be saved locally and synchronized to MongoDB when online.

---

## Conclusion

This project combines modern web technologies with offline desktop support, enabling dynamic content management for signage displays. Use the Vercel deployment for live production or the Electron app for offline use.

For any further questions, feel free to reach out or explore the deployed app: [https://signage-content-web-app.vercel.app/](https://signage-content-web-app.vercel.app/). 🚀

---

## References

[Fabric.js](https://fabricjs.com/)
[Fabric.js Video Tutorial](https://www.youtube.com/watch?v=eSiEBH7D1mM&list=PLOmd6EbLLA_oLtJ9howoPC01788f1dtEz)
[Electron.js](https://www.electronjs.org/docs/latest/tutorial/quick-start)
[Electron Video Tutorial](https://www.youtube.com/watch?v=ONpVol7B7AY)
