const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();
const { checkRoom, joinUser, createRoom } = require("./controller");
const socketController = require("./socketController");

const url = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/liveChat";

const app = express();
const server = http.createServer(app, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const io = socketio(server);
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
try {
  mongoose.connect(url);
} catch (e) {
  console.log("Error connecting", e);
}

io.on("connection", (socket) => {
  socketController.handelUserLeft(socket, io);
  socketController.deleteSocket(socket, io);
  socketController.handelSocket(socket, io);
  socketController.handelMessage(socket, io);
});
io.on("disconnect", (socket) => {
  console.log("disconnect", socket.id);
});
// app.post("/api/:userId/:roomName);
app.post("/joinuser", joinUser);
app.get("/check/:room", checkRoom);

app.post("/newroom/:room/:username", createRoom);

app.get("/createroom", (req, res) => {
  res.sendFile(__dirname + "/public/createroom.html");
});

app.get("/:file", (req, res) => {
  res.sendFile(__dirname + req.params.file);
});

server.listen(process.env.PORT || 8080, () =>
  console.log(`server is running on port ${process.env.PORT || 8080}`)
);
