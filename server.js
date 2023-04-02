import express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import http from "http";
import { Server } from "socket.io";

import formatMessage from "./utils/messages.js";
import { userJoin, getCurrentUser } from "./utils/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const botName = "oliviertech";

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// run when client connect
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    //   welcome current user
    socket.emit("message", formatMessage(botName, "welcome to chatCord"));

    //   broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined chat`)
      );
  });

  // listen for chatMessage
  socket.on("chatMessage", (chatmessage) => {
    const user = getCurrentUser(socket.id);
    console.log(chatmessage, user);
    // send chatmessage back to client
    io.to(user.room).emit("message", formatMessage(user.username, chatmessage));
  });

  //   Runs when clients disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A User has left the chat"));
  });
});

const PORT = 5000 || process.env.PORT;
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
