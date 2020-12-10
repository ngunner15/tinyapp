const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const { emailLookup } = require('./helpers');
const { urlsForUser } = require('./helpers');
const { generateRandomString } = require('./helpers');

const app = express();
const PORT = 3000; // default port 8080

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['b6d0e7eb-8c4b-4ae4-8460-fd3a08733dcb', '1fb2d767-ffbf-41a6-98dd-86ac2da9392e'],
}));

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  ytMcC1: { longURL: "https://stackoverflow.com", userID: "hhj90T" }
};

let users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "hhj90T": {
    id: "hhj90T",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

// function emailLookup(emailId) {
//   let flag = false;
//   for (const key in users) {
//     if (users[key].email === emailId) {
//       flag = true;
//     }
//   }
//   return flag;
// }

// function emailPasswordLookup(emailId, password) {
//   let flag = false;
//   for (const key in users) {
//     if (users[key].email === emailId && users[key].password === password) {
//       setCookie(users[key].id);
//       flag = true;
//     }
//   }
//   return flag;
// }

// function setCookie(emailId, password) {
//   let cookie = undefined;
//   for (const key in users) {
//     if (users[key].email === emailId && users[key].password === password) {
//       cookie = users[key].id;
//     }
//   }
//   return cookie;
// }



app.get("/", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    const templateVars = { user: users[req.session.user_id] };
    res.render("urls_login", templateVars);
  } 
});

app.get("/login", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    const templateVars = { user: users[req.session.user_id] };
    res.render("urls_login", templateVars);
  } 
});

app.get("/register", (req, res) => {
  if (req.session.user_id) {
    res.redirect("/urls");
  } else {
    const templateVars = { user: users[req.session.user_id] };
    res.render("urls_registration", templateVars);
  } 
});

app.get("/urls", (req, res) => {
  console.log(req.session.user_id);
  if (urlsForUser(req.session.user_id, urlDatabase)) {
    const templateVars = {
      user: users[req.session.user_id],
      urls: urlsForUser(req.session.user_id, urlDatabase)
    };
    res.render("urls_index", templateVars);
  } else {
    res.send("Login to view the urls page.");
  }
});

app.get("/urls/new", (req, res) => {
  const templateVars = { user: undefined };
  if (req.session.user_id) {
    templateVars.user = users[req.session.user_id];
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  if (urlsForUser(req.session.user_id, urlDatabase)[req.params.shortURL]) {
    const templateVars = {
      user: users[req.session.user_id],
      shortURL: req.params.shortURL,
      longURL: urlsForUser(req.session.user_id, urlDatabase)[req.params.shortURL].longURL
    };
    res.render("urls_show", templateVars);
  } else {
    res.send("Log in first");
  }
});

app.get("/u/:shortURL", (req, res) => {
  //console.log(urlDatabase[req.params.shortURL]);
  const longU = urlDatabase[req.params.shortURL].longURL;
  console.log(longU);
  res.redirect(longU);
});

app.post("/urls", (req, res) => {
  let longUrl = req.body.longURL;
  let shortUrl = generateRandomString();
  urlDatabase[shortUrl] = {longURL: longUrl, userID: req.session.user_id};
  res.redirect(`/urls/${shortUrl}`);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlsForUser(req.session.user_id, urlDatabase)[req.params.shortURL]) {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls/");
  } else {
    res.status(403).send("Log in first!!!");
  }
});

app.post("/urls/:id", (req, res) => {
  if (urlsForUser(req.session.user_id, urlDatabase)[req.params.id]) {
    urlDatabase[req.params.id].longURL = req.body.editURL; //req.body ---> whatever is in the form we can access it
    res.redirect("/urls/");
  } else {
    res.status(403).send("Log in first!!!");
  }
});

app.post("/login", (req, res) => {
  let newUser = Object.values(emailLookup(req.body.email, users))[0];
  if (bcrypt.compareSync(req.body.password, newUser.password)) {
    req.session["user_id"] = newUser.id;
    res.redirect("/urls/");
  } else {
    res.status(403).send("Check your password or email again!!!");
  }
  // if (emailPasswordLookup(req.body.email, req.body.password)) {
  //   res.cookie("user_id", setCookie(req.body.email, req.body.password));
  //   res.redirect("/urls/");
  // } else {
  //   res.statusCode = 403;
  //   res.send("403");
  // }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

app.post("/register", (req, res) => {
  const randomId = generateRandomString();
  if (!req.body.email || !req.body.password) {
    res.status(400).send("password or email cannot be empty!!!");
  } else if (emailLookup(req.body.email, users)) {
    res.status(400).send("Cannot register with duplicate email!!!");
  } else {
    const newUser = {
      [randomId]: {
        id: randomId,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      }
    }
    users = { ...users, ...newUser };
    console.log(users);
    req.session["user_id"] = randomId;
    res.redirect("/urls/");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});