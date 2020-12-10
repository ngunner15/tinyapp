function emailLookup(email, database) {
  let user = {};
  for (const key in database) {
    if (database[key].email === email) {
      user[key] = database[key];
    }
  }
  if (Object.keys(user).length === 0) {
    return false;
  } else {
    return user;
  }
}

function urlsForUser(id, database) {
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
}

function generateRandomString() {
  const str = Math.random().toString(36).substr(2, 6);
  return str;
}

module.exports = { emailLookup, urlsForUser, generateRandomString };