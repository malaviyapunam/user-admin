const express = require('express');
const port = 5000;
const path = require('path');
const cookieParser = require('cookie-parser');
const db = require('./config/dbconnection');
const session = require('express-session');
const passport = require('passport');
const localSt = require("./config/passportStr");
const flash = require("connect-flash");
const flashConnect = require("./config/flashConnect");


const app = express();

// middleware
app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use("/", express.static(path.join(__dirname, 'public')))
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(express.urlencoded());
app.use(flash());

app.use(session({
    name: 'test',
    secret: 'admin',
    resave:true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60
    }
}));

app.use(passport.session());
app.use(passport.initialize());
app.use(passport.setAuthenticateUser);
app.use(flashConnect.setflash);
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
  }));
  // This will pass session to all views
  app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
  });

// routes
app.use("/", require('./routes/index.routes'));
app.use('/blogs',require('./routes/blog.routes'));




app.listen(port, ()=> {
    console.log(`Server start at http://localhost:${port}`);
})