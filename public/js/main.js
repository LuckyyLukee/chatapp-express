const chartrForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
// QS queryString library
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
// console.log(username, room);

const socket = io();

// join chatroom
socket.emit("joinRoom", { username, room });

// get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoom(room);
  outputUsers(users);
});

// message from server
socket.on("message", (message) => {
  console.log("message from server", message);
  outputMessage(message);
  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message submit
chartrForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get message text
  const msg = e.target.elements.msg.value;

  // emit message to server
  socket.emit("chatMessage", msg);

  // clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// output message to DOM
const outputMessage = (message) => {
  const div = document.createElement("div");

  div.classList.add("message");
  div.innerHTML = `
  <p class="meta">${message.username}<span>  ${message.time}</span></p>
  <p class="text">${message.text}</p>
  `;

  document.querySelector(".chat-messages").appendChild(div);
};

// output roomName to DOM
const outputRoom = (room) => {
  roomName.innerText = room;
};

// output users to DOM
const outputUsers = (users) => {
  userList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
};

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "../index.html";
  } else {
  }
});
