const mongoose = require('mongoose')
const Schema = mongoose.Schema

const lobbySchema = new Schema({
  players: [],
  roomId: String,
  owner: String,
  state: String,
})

module.exports = mongoose.model('Lobby', lobbySchema)