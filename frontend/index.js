const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();

app.use(express.static(path.join(__dirname, "public")));
//app to understand incoming data as JSON
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const { auth, requiresAuth } = require("express-openid-connect");

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.APP_URL || "http://localhost:3000",
  clientID: process.env.AUTH_CLIENTID,
  issuerBaseURL: "https://dev-rz-9ny0m.us.auth0.com",
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/login", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.get("/", (req, res) => {
  req.user = {
    isAuthenticated: req.oidc.isAuthenticated(),
  };
  if (req.user.isAuthenticated) {
    req.user.name = req.oidc.user.name;
  }
  res.render("home", { user: req.user });
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.get("/profilepage", (req, res) => {
  req.user = {
    isAuthenticated: req.oidc.isAuthenticated(),
  };
  if (req.user.isAuthenticated) {
    req.user.name = req.oidc.user.name;
  }
  res.render("profilepage", { user: req.user });
});

app.get("/copies", (req, res) => {
  req.user = {
    isAuthenticated: req.oidc.isAuthenticated(),
  };
  if (req.user.isAuthenticated) {
    req.user.name = req.oidc.user.name;
  }
  res.render("copies", { user: req.user });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
