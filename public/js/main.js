const chartrForm = document.getElementById("chat-form");

const chatMessages = document.querySelector(".chat-messages");

// QS queryString library
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
// console.log(username, room);

const socket = io();

// join chatroom
socket.emit("joinRoom", { username, room });

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