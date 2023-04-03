const users = [];

// join user to chat
const userJoin = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);

  return user;
};

// get current user
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// User leaves chat
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// User leaves chat
const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

export { userJoin, getCurrentUser, userLeave, getRoomUsers };
