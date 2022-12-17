if(process.env.NODE_ENV !== "production"){
    const dotenv = require("dotenv");
    require("dotenv").config();
}
const express = require('express');
const mariadb = require("mariadb");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/user', require('./routes/userRoutes'));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});