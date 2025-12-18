# Setup Instructions for Restaurant React App

## Quick Start Guide

Follow these steps to get the application running on your machine.

### 1. Install Backend Dependencies

Open a terminal and navigate to the backend folder:

```powershell
cd c:\Users\Innovatech\Desktop\fin__pro_IHM_V2\restaurant-react\backend
npm install
```

This will install:
- express
- cors
- bcryptjs
- jsonwebtoken
- sequelize
- sqlite3
- dotenv
- nodemon (dev dependency)

### 2. Seed the Database

While still in the backend folder, run:

```powershell
npm run seed
```

This creates:
- Database with all tables
- Admin user (admin@example.com / admin123)
- 12 sample dishes across all categories

### 3. Install Frontend Dependencies

Open a NEW terminal and navigate to the frontend folder:

```powershell
cd c:\Users\Innovatech\Desktop\fin__pro_IHM_V2\restaurant-react\frontend
npm install
```

This will install:
- react & react-dom
- react-router-dom
- axios
- react-icons
- react-toastify
- framer-motion
- tailwindcss & dependencies
- vite

### 4. Start the Backend Server

In the backend terminal:

```powershell
npm run dev
```

You should see:
```
✅ Database connection established successfully.
✅ Database models synchronized.
🚀 Server is running on http://localhost:5000
```

### 5. Start the Frontend Development Server

In the frontend terminal:

```powershell
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 6. Open the Application

Open your browser and go to: **http://localhost:5173**

### 7. Login

Use these credentials:
- **Email:** admin@example.com
- **Password:** admin123

Or register a new account!

## Troubleshooting

### Port Already in Use

If port 5000 or 5173 is already in use:

**Backend:** Edit `backend/.env` and change `PORT=5000` to another port

**Frontend:** Edit `frontend/vite.config.js` and change the port number

### Database Issues

If you encounter database errors, delete the database file and reseed:

```powershell
cd backend
Remove-Item database.sqlite
npm run seed
```

### Module Not Found

Make sure you ran `npm install` in both backend and frontend folders.

## What to Do Next

1. **Browse the Menu** - Click "Ajouter Plat" in the navbar
2. **Add to Cart** - Click on any dish and add it to your cart
3. **Place an Order** - Go to cart and confirm your order
4. **Add Favorites** - Click the heart icon on dishes
5. **View Orders** - Check "Mes Commandes" to see order history
6. **Add New Dishes** - As admin, you can add new dishes

## File Structure

```
restaurant-react/
├── backend/          # Node.js/Express API
│   ├── config/       # Database config
│   ├── models/       # Data models
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth middleware
│   └── server.js     # Main server file
│
└── frontend/         # React application
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # React context
    │   ├── pages/       # Page components
    │   └── services/    # API services
    └── public/          # Static assets
```

## Need Help?

Check the main README.md for:
- Complete API documentation
- Library equivalents from Flask
- Production build instructions
- Project architecture details

Enjoy your Restaurant App! 🍽️
