const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const app = express();

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1", //localhost
    port: 5432,
    user: "postgres",
    password: "admin",
    database: "face-detect",
  },
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("success");
});

app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, bcrypt, db);
});

app.post("/register", (req, res) => {
  register.handleRegister(req, res, bcrypt, db);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen(3001, () => {
  console.log("App is running on port 3001");
});

/*
ROUTES:
/ -->                   GET = this is working
/signin -->             POST = success/fail
/register -->           POST = user
/profile/:userID -->    GET = user
/image -->              PUT = user
*/
