
const dotenv = require('dotenv').config()
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const config = require('./config')
const index = require("./controllers/index");
const app = express();
const port = config.port;
const deck = require('./utils/deckOfCards')
const shuffle = require('./utils/shuffle')

const Lobby = require('./models/Lobby')

mongoose.connect(process.env.mongoUri);
app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(index);


const server = http.createServer(app);

const io = socketIo(server);


io.on("connection", socket => {
  console.log("new client connected")

  socket.on('do stuff', () => {
    console.log("PING")
    socket.emit("do it", "Hello")
  })
  
  socket.on('create lobby', (lobbyId, user) => {
    console.log(lobbyId, user)
    lobby = new Lobby()
    lobby.owner = user
    lobby.roomId = lobbyId
    lobby.state = "idle"
    lobby.players = []
    lobby.deck = shuffle(deck)
    lobby.markModified('cards')
    lobby.save()
  })
  socket.on('join lobby', (roomId, username) => {
    user = { username, roll:"villager", owner:false }
    socket.join(roomId)
    Lobby.findOne({ roomId }).then(lobby => {
      oldUser = lobby.players.reduce((reducer, player) => player.username === user.username ? player : reducer, {})
      if (!oldUser.username && lobby.state == "idle") {
        if (user.username === lobby.owner) {
          user.owner = true
        }
        lobby.players.push(user)
        lobby.markModified('users')
        lobby.save()
      }
      
      io.to(roomId).emit('update players', lobby.players)
    })
  })

  socket.on("disconnect", () => console.log("Client disconnected"));
});



server.listen(port, () => console.log(`Listening on port ${port}`));
