const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./src/routes/bookings');

const app = express();

app.use(cors({
  origin: 'https://proj-frontend-eight.vercel.app'
}));

app.use((req,res,next)=>{
   res.header("Access-Control-Allow-Origin", "*");
   next();
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/bookings', bookingRoutes);

module.exports = app;
