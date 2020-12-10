const getUserByEmail = function(email, database) {
  let user = {};
  for (const key in database) {
    if (database[key].email === email) {
      user[key] = database[key];
    }
  }
  if (Object.keys(user).length === 0) {
    return undefined;
  } else {
    return user;
  }
};

const urlsForUser = function(id, database) {
  let newDatabase = {};
  for (const key in database) {
    if (database[key].userID === id) {
      newDatabase[key] = database[key];
    }
  }
  if (Object.keys(newDatabase).length === 0) {
    return false;
  } else {
    return newDatabase;
  }
};

const generateRandomString = function() {
  const str = Math.random().toString(36).substr(2, 6);
  return str;
};

module.exports = { getUserByEmail, urlsForUser, generateRandomString };