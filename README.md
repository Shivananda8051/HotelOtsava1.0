Got it — you want a **clear, concise GitHub project description** for your `NammaNest` app so people understand what it is, what it does, and how to run it.

Based on your code, I’ll draft a **README**-style explanation:

---

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

   Visit: [http://localhost:8080](http://localhost:8080)

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

*(Add screenshots of homepage, listings page, review form, etc.)*

---

## 📜 License

This project is open source under the [MIT License](LICENSE).

---

I can make this **README.md** file ready for your GitHub repo so that it looks professional and instantly tells visitors what NammaNest is about.

Do you want me to prepare this as a **polished markdown file** you can directly paste into GitHub?
