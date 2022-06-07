// getting the prameter from the url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const username = urlParams.get("username");
const room = urlParams.get("room");

/**
 * creating the socket
 *
 */
const socket = io();

// checking the validity roomId

const checkSocket = (room) => {
  fetch(window.location.origin + "/check/" + room, { method: "GET" })
    .then((response) => response.json())
    .then((result) => {
      if (!result.success) {
        // window.location.replace(window.location.origin + "/createroom");
      }
    })
    .catch((error) => console.log("error", error));
};
checkSocket(room);

const userData = JSON.parse(localStorage.getItem("userdata"));

/**
 * get required elements
 */

const roomEntry = document.getElementById("room-name");
const usersEntry = document.getElementById("users");
const allmessages = document.getElementsByClassName("chat-messages")[0];
const form = document.getElementById("chat-form");

roomEntry.innerHTML = room;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = e.target.elements.msg.value;
  message = message.trim();
  if (!message) {
    return false;
  }
  socket.emit("message", { message, time: moment().format("h:mm a") });
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

socket.emit("join", { username, room });

socket.on("message", (message) => {
  console.log(message);
  const div = document.createElement("div");
  div.className = `message ${
    message.userName === "Bot"
      ? "centerBot"
      : message.userName === username
      ? "right"
      : "left"
  }`;

  div.innerHTML = `<span class="time">${message.time}</span>
  <p class="meta">${message.userName}</p>
  <p class="text">
    ${message.message}
  </p>`;
  allmessages.appendChild(div);
  div.scrollIntoView({ behavior: "smooth", block: "end" });
});

socket.on("roomUsers", ({ room, users }) => {
  console.log("users join and adding to list", users);
  addUser(users);
});

const addUser = (users) => {
  usersEntry.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.userName;
    usersEntry.appendChild(li);
  });
};
