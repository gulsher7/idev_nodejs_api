if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const my_routes = require("./src/routes");
const chatSocket = require("./src/socekts/chatSocket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
/*
CORS is a security feature implemented by web browsers to restrict web pages from making requests to a 
different domain than the one that served the original web page.
app.use(cors({
  origin: 'http://example.com', // specify the allowed origin(s)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // include credentials in cross-origin requests
  optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
*/
app.use(morgan("dev")); // Middleware for logging HTTP requests in development mode
app.use(express.json({ extended: true })); // Middleware for parsing JSON requests with a 30MB limit
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded requests with a 30MB limit

app.get("/", (req, res) => {
  res.send("Hello, Express");
});

app.use("/", my_routes);
chatSocket(io);

mongoose
  .connect(process.env.DB)
  .then(() => {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(
        `MongoDB connected, Server is listening at http://localhost:${port}`
      );
    });
  })
  .catch((error) => console.error(`${error}... Did not connect`));
