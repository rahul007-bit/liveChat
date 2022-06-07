const { Room, User } = require("./model");

const createRoom = (req, res) => {
  try {
    console.log("creating");
    Room.create({ roomName: req.params.room }, (err, room) => {
      if (err) {
        res.send({ success: false, message: "Room already exists" });
      } else {
        console.log("created room");
        User.findOne(
          {
            userName: req.params.username,
          },
          (err, docs) => {
            if (!docs) {
              console.log("user saved successfully");
              res.send({ success: true, result: docs });
            } else {
              console.log(err);
              res.send({ success: false, message: "User Exits" });
            }
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
    res.send({ success: false, message: "something went wrong" });
  }
};

const joinUser = (req, res) => {
  const room = req.body.room;
  const user = req.body.username;
  try {
    Room.findOne({ roomName: room }, (err, docs) => {
      if (err) {
        res.send({ success: false });
      } else {
        if (docs) {
          User.findOne({ userName: user, roomName: room }, (err, docs) => {
            if (!docs) {
              console.log(docs);
              res.send({ success: true, result: docs });
            } else {
              res.send({
                success: false,
                message: `user Name ${user} already exist`,
              });
            }
          });
        } else {
          res.send({ success: false, message: "Room Not Found" });
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
  // res.send({ body: req.body });
};

const leaveUser = (userId) => {
  User.findByIdAndDelete(userId);
  return;
};
const checkRoom = (req, res) => {
  Room.findOne({ roomName: req.params.room }, function (err, docs) {
    if (err) {
      res.send({ success: false });
    } else {
      if (docs) {
        res.send({ success: true, result: docs });
      } else {
        res.send({ success: false });
      }
    }
  });
};

module.exports = {
  checkRoom,
  leaveUser,
  joinUser,
  createRoom,
};
