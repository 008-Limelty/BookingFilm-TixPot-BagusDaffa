# 🍿 TixPot - Cinema Booking System

TixPot is a modern, full-stack cinema ticket booking application that allows users to browse movies, select seats, and complete payments seamlessly. It features a robust administration dashboard for managing movies, schedules, and bookings.

---

## 🚀 Features

- **User Authentication**: Secure login and registration using JWT and Bcrypt.
- **Seat Selection**: Interactive seat map for real-time seat choosing.
- **Payment Integration**: Integrated with **Midtrans** for secure Indonesian payment methods.
- **Admin Dashboard**: Comprehensive control panel to manage movie data, showtimes, and user bookings.
- **Responsive UI**: Beautifully designed with React and Tailwind CSS for mobile and desktop.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State/Routing**: React Router Dom, Axios

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/)
- **Auth**: JWT (JSON Web Tokens), Bcrypt
- **Payments**: Midtrans Client SDK

---

## 📂 Project Structure

```text
├── client/              # Frontend React application
│   ├── src/             # Source code
│   └── public/          # Static assets
├── server/              # Backend Node.js API
│   ├── routes/          # Express routes
│   ├── config/          # Database configuration
│   └── setup.js         # Database initialization script
└── README.md            # You are here!
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js (v18+)
- MySQL Server

### 2. Database Setup
1. Create a database named `cinema_db` in MySQL.
2. Navigate to the `server` directory.
3. Configure your `.env` file (see below).
4. Run the setup script:
   ```bash
   npm run db:setup
   ```

### 3. Server Configuration
Create a `.env` file in the `server` directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=cinema_db
JWT_SECRET=your_jwt_secret
MIDTRANS_SERVER_KEY=your_midtrans_key
```

### 4. Installation
Install dependencies for both client and server:

**Server:**
```bash
cd server
npm install
npm run dev
```

**Client:**
```bash
cd client
npm install
npm run dev
```

---

## 📸 Screenshots

*(Add your screenshots here)*

---

## 📝 License

This project is licensed under the ISC License.

---

## 👤 Author

**Bagus Daffa**
- GitHub: [@BagusDaffa](https://github.com/BagusDaffa)
