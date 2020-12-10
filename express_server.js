const express = require("express");
const app = express();
const PORT = 3000; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  ytMcC1: { longURL: "https://stackoverflow.com", userID: "hhj90T" }
};

let users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "hhj90T": {
    id: "hhj90T",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

function generateRandomString() {
  const str = Math.random().toString(36).substr(2, 6);
  return str;
}

function emailLookup(emailId) {
  let flag = false;
  for (const key in users) {
    if (users[key].email === emailId) {
      flag = true;
    }
  }
  return flag;
}

function emailPasswordLookup(emailId, password) {
  let flag = false;
  for (const key in users) {
    if (users[key].email === emailId && users[key].password === password) {
      setCookie(users[key].id);
      flag = true;
    }
  }
  return flag;
}

function setCookie(emailId, password) {
  let cookie = undefined;
  for (const key in users) {
    if (users[key].email === emailId && users[key].password === password) {
      cookie = users[key].id;
    }
  }
  return cookie;
}

function urlsForUser(id) {
  let newDatabase = {};
  for (const key in urlDatabase) {
    if (urlDatabase[key].userID === id) {
      newDatabase[key] = urlDatabase[key];
    }
  }
  if (Object.keys(newDatabase).length === 0) {
    return false;
  } else {
    return newDatabase;
  }
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/login", (req, res) => {
  const templateVars = { user: undefined };
  if (req.cookies["user_id"]) {
    templateVars.user = users[req.cookies["user_id"]];
  }
  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  const templateVars = { user: undefined };
  if (req.cookies["user_id"]) {
    templateVars.user = users[req.cookies["user_id"]];
  }
  res.render("urls_registration", templateVars);
});

app.get("/urls", (req, res) => {
  if (urlsForUser(req.cookies["user_id"])) {
    const templateVars = {
      user: users[req.cookies["user_id"]],
      urls: urlsForUser(req.cookies["user_id"])
    };
    res.render("urls_index", templateVars);
  } else {
    res.send("Log in first");
  }
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: undefined };
  if (req.cookies["user_id"]) {
    templateVars.user = users[req.cookies["user_id"]];
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (urlsForUser(req.cookies["user_id"])[req.params.shortURL]) {
    const templateVars = {
      user: users[req.cookies["user_id"]],
      shortURL: req.params.shortURL,
      longURL: urlsForUser(req.cookies["user_id"])[req.params.shortURL].longURL
    };
    res.render("urls_show", templateVars);
  } else {
    res.send("Log in first");
  }
});

app.get("/u/:shortURL", (req, res) => {
  const longU = urlDatabase[req.params.shortURL].longURL;
  console.log(longU);
  res.redirect(longU);
});

app.post("/urls", (req, res) => {
  let longUrl = req.body.longURL;
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl].longURL = longUrl;
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlsForUser(req.cookies["user_id"])[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls/");
  } else {
    res.statusCode = 403;
    res.send("Log in first");
  }
});

app.post("/urls/:id", (req, res) => {
  if (urlsForUser(req.cookies["user_id"])[req.params.id]) {
    urlDatabase[req.params.id].longURL = req.body.editURL; //req.body ---> whatever is in the form we can access it
    res.redirect("/urls/");
  } else {
    res.statusCode = 403;
    res.send("Log in first");
  }
});

app.post("/login", (req, res) => {
  if (emailPasswordLookup(req.body.email, req.body.password)) {
    res.cookie("user_id", setCookie(req.body.email, req.body.password));
    res.redirect("/urls/");
  } else {
    res.statusCode = 403;
    res.send("403");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  const randomId = generateRandomString();
  if (!req.body.email || !req.body.password || emailLookup(req.body.email)) {
    res.statusCode = 400;
    res.send("400");
  } else {
    const newUser = {
      [randomId]: {
        id: randomId,
        email: req.body.email,
        password: req.body.password
      }
    }
    users = { ...users, ...newUser };
    res.cookie("user_id", randomId);
    res.redirect("/urls/");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});