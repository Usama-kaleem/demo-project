import express  from 'express';
import './database/index';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import taskListRoutes from './routes/taskList.routes';
import cors from 'cors';

const socketIo = require('socket.io');
const app = express();
const port = 3000;

//changes
var server = require('http').createServer(app);
const io = socketIo(server, {
  cors: {
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket: any) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/taskList', taskListRoutes);



server.listen(port, () => {
  console.log(`Server is running socket http://localhost:${port}`);
});
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });
export { io };
