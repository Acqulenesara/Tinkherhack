const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/daily-journal-app', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a user model
const User = mongoose.model('User', {
    username: String,
    password: String
});

// Passport configuration
passport.use(new LocalStrategy(
    (username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false, { message: 'Incorrect username.' });

            bcrypt.compare(password, user.password, (err, result) => {
                if (err) return done(err);
                if (!result) return done(null, false, { message: 'Incorrect password.' });

                return done(null, user);
            });
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Check if username is already taken
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already taken.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
        username: username,
        password: hashedPassword
    });

    // Save the user to the database
    newUser.save((err) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        return res.status(201).json({ message: 'User registered successfully.' });
    });
});

// Login route
app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
        failureFlash: true
    })
);

// Logout route
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Dashboard route (protected)
app.get('/dashboard', (req, res) => {
    if (req.isAuthenticated()) {
        // Here you would render the dashboard or redirect to the journal page
        res.send('Welcome to the Dashboard!');
    } else {
        res.redirect('/');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
