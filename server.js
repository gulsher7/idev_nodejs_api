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
const chatSocket = require('./src/socekts/chatSocket');


const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./src/config/database');
const my_routes = require('./src/routes');
const { firebase } = require("./src/firebase");

app.get('/', (req, res) => {
  res.send('Hello, Express');
});

app.use('/', my_routes)
chatSocket(io)

setTimeout(() => {
  sendNotifcation()
}, 1000);
server.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});





const sendNotifcation = () =>{
  const message = {
    data: {
      score: '850',
      time: '2:45'
    },
    token: "foNIjC3tThqGfRmtiqgINw:APA91bGlGHTgLUVkj7vIbIEGFu5yzzqfvtTsNnaPn2VNS-zTjuGxqIwJdsi9BBDKUmEZIeGs3yXGuhVtEYv9olvmhWROESZelGf9SiAnNyl9LEIHGiacQRmQfY8KTl5VQCzX9N2dDH7B"
  };
  
  console.log("sending.....notification")

  firebase.messaging().send({
    data:{ notifee: JSON.stringify({
      title: `messaged you`,
      body: 'notificationData?.text',
      data: {
        _id: '2323',
      },
      android: {
        channelId: 'default2',
        sound: "default",
        defaultSound: true,
        importance: 4,
        actions: [
          {
            title: 'Open',
            pressAction: {
              id: 'open-chat',
              launchActivity: 'default',
            },
          },
        ],
      },
    })},
    token: "foNIjC3tThqGfRmtiqgINw:APA91bGlGHTgLUVkj7vIbIEGFu5yzzqfvtTsNnaPn2VNS-zTjuGxqIwJdsi9BBDKUmEZIeGs3yXGuhVtEYv9olvmhWROESZelGf9SiAnNyl9LEIHGiacQRmQfY8KTl5VQCzX9N2dDH7B"
  })
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
}
