const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Admin@123',
    database: 'carint'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL', err);
        return;
    }
    console.log('Connected to MySQL');
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

// Registration Endpoint
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    try {
       

        const user = { username, password, email };
        // Save the user to the database
        db.query('INSERT INTO users SET ?', user, (error, results) => {
            if (error) {
                console.error('Error registering new user:', error);
                res.status(500).send('Error registering new user.');
            } else {
                res.status(201).send('User registered successfully!');
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Error during registration.');
    }
});


// Login Endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
        if (error) {
            console.error('Error logging in:', error);
            res.status(500).send('Error logging in.');
            return;
        }

        if (results.length === 0) {
            res.status(401).send('Username does not exist.');
            return;
        }

        const user = results[0];
        const passwordMatch = await (password === user.password);

        if (passwordMatch) {
            res.status(200).send('Logged in successfully!');
        } else {
            res.status(401).send('Password is incorrect.');
        }
    });
});
