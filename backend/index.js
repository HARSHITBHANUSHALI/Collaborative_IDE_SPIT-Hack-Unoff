require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/dbConn')
const verifyJWT = require('./middleware/verifyJwt');


const port = process.env.PORT || 4000;

connectDB();

app.use(express.json());

const allowedOrigins = ['http://localhost:5173']; // Add allowed frontend URLs

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true 
}));


app.use('/auth', require('./routes/authRoutes'));

// app.use(verifyJWT);

app.use('/compile', require('./routes/compileRoutes'));

app.listen(port,()=>console.log(`Server running on Port ${port}`));