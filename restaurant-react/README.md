# Restaurant App - React + Node.js

A modern, full-stack restaurant ordering application built with React.js and Node.js/Express, converted from Flask.

## 🚀 Features

- ✅ User authentication (Register, Login, Logout)
- ✅ Browse menu with filtering and search
- ✅ Add dishes to cart
- ✅ Place orders
- ✅ Manage favorites
- ✅ View order history
- ✅ Admin panel to add dishes
- ✅ Responsive design with Tailwind CSS
- ✅ Modern UI with animations

## 📚 Tech Stack

### Backend
- **Node.js** + **Express.js** - Web framework
- **Sequelize** - ORM for database operations
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icons
- **Framer Motion** - Animations

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 3: Seed the Database

```bash
cd backend
npm run seed
```

This will create:
- Admin user: `admin@example.com` / `admin123`
- Sample dishes in all categories

### Step 4: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 🎯 Usage

1. **Open your browser** and navigate to `http://localhost:5173`

2. **Register a new account** or login with:
   - Email: `admin@example.com`
   - Password: `admin123`

3. **Browse the menu**, add dishes to cart, and place orders!

## 📁 Project Structure

```
restaurant-react/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── models/                   # Sequelize models
│   │   ├── User.js
│   │   ├── Dish.js
│   │   ├── CartItem.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   ├── Favorite.js
│   │   └── index.js
│   ├── routes/                   # API routes
│   │   ├── auth.js
│   │   ├── dishes.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── favorites.js
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── server.js                # Express server
│   ├── seed.js                  # Database seeder
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   └── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # Authentication context
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Menu.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Orders.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Favorites.jsx
    │   │   └── AddDish.jsx
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Dishes
- `GET /api/dishes` - Get all dishes
- `GET /api/dishes/popular` - Get popular dishes
- `GET /api/dishes/new` - Get new dishes
- `POST /api/dishes` - Add new dish (admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add/:dishId` - Add dish to cart
- `DELETE /api/cart/:itemId` - Remove item from cart
- `PUT /api/cart/:itemId` - Update cart item quantity

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders/confirm` - Confirm order from cart

### Favorites
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites/add/:dishId` - Add to favorites
- `DELETE /api/favorites/remove/:dishId` - Remove from favorites

## 🎨 Library Equivalents

| Flask Library | React/Node.js Equivalent |
|--------------|-------------------------|
| Flask | Express.js |
| Flask-SQLAlchemy | Sequelize |
| Flask-Login | JWT + bcryptjs |
| Flask-Bootstrap | Tailwind CSS |
| Werkzeug | bcryptjs |
| Jinja2 Templates | React Components (JSX) |

## 🌟 Features Comparison

All features from the Flask app have been implemented:

✅ User registration and authentication  
✅ Menu browsing with categories  
✅ Search and filter dishes  
✅ Shopping cart management  
✅ Order placement and history  
✅ Favorites system  
✅ User profile  
✅ Admin dish management  
✅ Responsive design  
✅ Toast notifications  

## 📝 Notes

- The frontend uses Vite proxy to forward API requests to the backend
- JWT tokens are stored in localStorage
- All passwords are hashed with bcryptjs
- The app uses SQLite for easy setup (can be changed to PostgreSQL/MySQL)

## 🚀 Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 📄 License

MIT License

## 👨‍💻 Author

Converted from Flask to React.js + Node.js
