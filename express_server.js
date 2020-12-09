const express = require("express");
const app = express();
const PORT = 3000; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
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
  const templateVars = {
    user: undefined,
    urls: urlDatabase
  };
  if (req.cookies["user_id"]) {
    templateVars.user = users[req.cookies["user_id"]];
  }
  res.render("urls_index", templateVars);
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
  const templateVars = {
    user: undefined,
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]
  };
  if (req.cookies["user_id"]) {
    templateVars.user = users[req.cookies["user_id"]];
  }
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  let longUrl = req.body.longURL;
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = longUrl;
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls/");
});

app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.editURL; //req.body ---> whatever is in the form we can access it
  res.redirect("/urls/");
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
  res.redirect("/urls/");
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