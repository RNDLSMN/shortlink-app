const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const app = express();
const saltRounds = 10;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
}));

// Rate limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: "Too many login attempts from this IP, please try again after 15 minutes."
});

app.use('/login', loginLimiter);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/shortlink', { useNewUrlParser: true, useUnifiedTopology: true });
const User = mongoose.model('User', new mongoose.Schema({
    email: String,
    username: String,
    hashedPassword: String
}));
const Link = mongoose.model('Link', new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    originalUrl: { type: String, unique: true },
    shortUrl: String
}));

// Registration route
app.post('/register', [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ email, username, hashedPassword });
    await user.save();
    res.redirect('/login');
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.hashedPassword)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }
});

// CMS dashboard route (protected)
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.sendFile(__dirname + '/public/dashboard.html');
    } else {
        res.redirect('/login');
    }
});

// Add new link route
app.post('/links', async (req, res) => {
    if (!req.session.user) return res.status(401).send('Unauthorized');

    const { originalUrl } = req.body;
    const existingLink = await Link.findOne({ originalUrl });
    if (existingLink) return res.status(400).send('URL already exists');

    const shortUrl = generateShortUrl();
    const link = new Link({ userId: req.session.user._id, originalUrl, shortUrl });
    await link.save();
    res.redirect('/dashboard');
});

// Edit link route
app.put('/links/:id', async (req, res) => {
    if (!req.session.user) return res.status(401).send('Unauthorized');

    const { id } = req.params;
    const { originalUrl } = req.body;
    const link = await Link.findOneAndUpdate({ _id: id, userId: req.session.user._id }, { originalUrl });
    if (!link) return res.status(404).send('Link not found');
    res.redirect('/dashboard');
});

// Delete link route
app.delete('/links/:id', async (req, res) => {
    if (!req.session.user) return res.status(401).send('Unauthorized');

    const { id } = req.params;
    const link = await Link.findOneAndDelete({ _id: id, userId: req.session.user._id });
    if (!link) return res.status(404).send('Link not found');
    res.redirect('/dashboard');
});

// Function to generate short URL
function generateShortUrl() {
    return Math.random().toString(36).substr(2, 8);
}

// Static files
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
