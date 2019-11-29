const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lobbySchema = new Schema({
  players: [],
  roomId: String,
  owner: String,
  state: String,
  numWolves: Number,
  votes: [{
    player: String,
    vote: String,
  }]
})

module.exports = mongoose.model('Lobby', lobbySchema)