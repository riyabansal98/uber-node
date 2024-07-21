const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const driverRoutes = require('./routes/driverRoutes');
const passengerRoutes = require('./routes/passengerRoutes');
const { redisClient } = require('./utils/redisClient');
const mongoose = require('mongoose');


dotenv.config();


const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: "http://127.0.0.1:5500", // Update to match your frontend URL
      methods: ["GET", "POST"]
    }
});

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes(io));
app.use('/api/drivers', driverRoutes);
app.use('/api/passengers', passengerRoutes(io));

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('registerDriver', async (driverId) => {
      const response = await redisClient.set(`driver:${driverId}`, socket.id);
      console.log("set driver socket", response);
    });

   
  
    socket.on('disconnect', async () => {
      console.log('A user disconnected');
      const driverId = await redisClient.get(`driver:${socket.id}`);
      if (driverId) {
        await redisClient.del(`driver:${driverId}`);
      }
    });
});

