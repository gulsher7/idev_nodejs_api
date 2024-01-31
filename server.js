if(process.env.NODE_ENV !== "production"){
  require("dotenv").config();
}
const { Server } = require("socket.io");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const http = require('http')
const server = http.createServer(app)
const chatSocket = require('./src/socekts/chatSocket')

const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./src/config/database');
const my_routes = require('./src/routes');

app.get('/', (req, res) => {
  res.send('Hello, Express');
});

app.use('/', my_routes)
chatSocket(io)


server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
