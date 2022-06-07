const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const moment = require("moment");

const user_schema = mongoose.Schema({
  userName: { type: "string", required: true, unique: true },
  roomName: { type: "string", required: true },
  socketId: { type: "string" },
});

user_schema.plugin(uniqueValidator);

const Chat_schema = mongoose.Schema({
  message: { type: "string", required: true },
  sender: { type: "string", required: true },
  roomId: { type: "string", required: true },
  time_stamp: { created_at: "string" },
});

const Room_Schema = mongoose.Schema({
  roomName: { type: "string", required: true, unique: true },
  users: [],
});
Room_Schema.plugin(uniqueValidator);

const socket_schema = mongoose.Schema({
  socketId: { type: "string", required: true },
  userName: { type: "string", required: true },
  roomName: { type: "string", required: true },
});
socket_schema.plugin(uniqueValidator);

const Room = mongoose.model("Room", Room_Schema);
const Chat = mongoose.model("Chat", Chat_schema);
const User = mongoose.model("User", user_schema);
const Socket = mongoose.model("Socket", socket_schema);
module.exports = { Room, Chat, User, Socket };
