require('dotenv').config();
const express = require('express');
const app = express();

// homepage
app.get('/', (req, res) => {
    res.send("CDRU Application");
});

// Vulnerability #1: Reflected XSS
app.get('/user', (req, res) => {
    const name = req.query.name;
    res.send(`<h1>Hello ${name}</h1>`);
});

// Vulnerability #2: Sensitive data exposure
app.get('/debug', (req, res) => {
    res.json({
        env: process.env, // leaks EVERYTHING
        message: "Debug info exposed"
    });
});

// Vulnerability #3: Broken auth
app.get('/admin', (req, res) => {
    if (req.query.email === process.env.ADMIN_EMAIL) {
        res.send("Welcome admin!");
    } else {
        res.send("Access denied");
    }
});

// Vulnerability #4: Input abuse (DAST detectable)
app.get('/search', (req, res) => {
    const query = req.query.q;
    res.send(`You searched for: ${query}`);
});

// Logging for forensics (IMPORTANT)
app.use((req, res, next) => {
    console.log(`IP: ${req.ip} | Path: ${req.path} | Query: ${JSON.stringify(req.query)}`);
    next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});