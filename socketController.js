const moment = require("moment");
const { User, Socket } = require("./model");
let socketController = Object.create(null);
// TODO: create controller for all the socket

socketController.handelSocket = (socket, io) => {
  socket.on("join", ({ username, room }) => {
    socketController.createUser(username, room, socket.id, io);
    // console.log("working socket handel", socket.id);
    socket.join(room);
    io.to(room).emit("message", {
      userName: "Bot",
      message: `${username} has joind the room`,
      time: moment().format("h:mm a"),
    });
    socketController.createSocket(socket.id, room, username);
  });
};

socketController.handelUserLeft = (socket, io) => {
  socket.on("disconnect", () => {
    // console.log("user left");
    User.findOne({ socketId: socket.id }, (err, user) => {
      //   console.log(user, "user found to left");
      if (user) {
        io.to(user.roomName).emit("message", {
          userName: "Bot",
          message: `${user.userName} has left the room`,
          time: moment().format("h:mm a"),
        });

        User.deleteOne({ _id: user._id }, (err, user) => {
          if (err) console.log(err);
          //   else console.log(user, "deleted");
          socketController.getUser(user.roomName, io);
        });
      }
    });
  });
};

socketController.handelMessage = (socket, io) => {
  socket.on("message", ({ message, time }) => {
    Socket.findOne({ socketId: socket.id }, (err, soc) => {
      if (err) {
        console.log(err);
      } else if (soc) {
        // console.log("find user", soc);
        io.to(soc.roomName).emit("message", {
          userName: soc.userName,
          message,
          time,
        });
      }
    });
  });
};

socketController.createUser = (username, room, socketId, io) => {
  User.create(
    { userName: username, roomName: room, socketId: socketId },
    (err, user) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(user);
      }
      socketController.getUser(room, io);
    }
  );
};

socketController.getUser = (room, io) => {
  User.find({ roomName: room }, (err, users) => {
    if (err) console.log(err);
    else {
      //   console.log("Users found");
      //   console.log(users);
      io.to(room).emit("roomUsers", {
        room,
        users,
      });
    }
  });
};

socketController.createSocket = (socketId, room, username) => {
  Socket.create(
    { socketId: socketId, roomName: room, userName: username },
    (err, socket) => {
      if (err) console.log(err);
      //   else console.log(socket);
    }
  );
};

socketController.deleteSocket = (socket, io) => {
  socket.on("disconnect", () => {
    // console.log(socket.id);
    // console.log("deleteSocket called");
    Socket.deleteOne({ socketId: socket.id }, { new: true }, (err, socket) => {
      if (err) console.log(err);
      else {
        // console.log(socket, "socket deleted");
      }
    });
  });
};

module.exports = socketController;
