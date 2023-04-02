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

export { userJoin, getCurrentUser };
