require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const loanRoutes = require('./routes/loans');
const userRoutes = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:8080', // Vue frontend
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files for uploads (will be used for vulnerability #5)
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

app.get('/', (req, res) => {
  res.send('Library API is running...');
});

// Sync Database and Start Server
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
    app.listen(port, () => {
        console.log(`Backend running on port ${port}`);
    });
}).catch(err => {
    console.error('Failed to sync db: ' + err.message);
});
