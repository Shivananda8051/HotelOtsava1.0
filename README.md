
# 🏡 NammaNest

**NammaNest** is a full-stack web application for listing, browsing, and reviewing rental properties — inspired by platforms like Airbnb.

Built with **Node.js**, **Express**, **MongoDB**, and **EJS**, it allows users to become hosts, post listings, and interact with other users' listings by leaving reviews.

---

## 🚀 Features

* **User Authentication** (Sign up, Login, Logout) using Passport.js
* **Session Management** with MongoDB-backed sessions
* **Create, Edit, and Delete Listings** for properties
* **Leave Reviews** on listings
* **Flash Messages** for user feedback
* **Responsive UI** with EJS templates and partials
* **MongoDB Atlas Integration** for cloud-hosted database

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **Frontend**: EJS, Bootstrap/CSS
* **Database**: MongoDB Atlas
* **Authentication**: Passport.js (Local Strategy)
* **Session Store**: connect-mongo
* **Templating Engine**: ejs-mate

---

## 📂 Project Structure

```
.
├── app.js                  # Main application entry point
├── models/                 # Mongoose models (User, Listing, Review)
├── routes/                 # Route handlers
├── views/                  # EJS templates (layouts, partials, pages)
├── public/                 # Static assets (CSS, JS, images)
├── utils/                  # Custom error handling
└── .env                    # Environment variables
```

---

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/NammaNest.git
   cd NammaNest
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file**

   ```env
   NODE_ENV=development
   ATLASDB_URL=<your-mongodb-atlas-url>
   SECRET=<your-session-secret>
   ```

4. **Run the app**

   ```bash
   npm start
   ```

   Visit: https://nammanest.onrender.com/listings

---

## 🌐 Deployment

* **Platform**: Render
* **Environment Variables** must be set in the Render dashboard:

  * `NODE_ENV=production`
  * `ATLASDB_URL`
  * `SECRET`
* **Build Command**: `npm install`
* **Start Command**: `node app.js`

---

## 📸 Screenshots

<img width="1901" height="1032" alt="image" src="https://github.com/user-attachments/assets/58cdd7e6-0a59-4f2b-a52d-7c13b5c7f3a9" />
<img width="1919" height="969" alt="image" src="https://github.com/user-attachments/assets/76492ff2-d335-4e31-a914-b60e54412f68" />

---
