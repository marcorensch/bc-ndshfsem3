import * as dotenv from 'dotenv';
dotenv.config();
import * as https from "https";
import express from 'express';
import 'babel-polyfill';
import cors from 'cors';
import usersRoute from './routes/users.mjs';
import questionsRoute from './routes/questions.mjs';
import authRoute from './routes/auth.mjs';
import categoriesRoute from './routes/categories.mjs';
import * as fs from "fs";

const app = express();
const port = process.env.PORT || 3000;

let corsOptions = {
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,// some legacy browsers (IE11, various SmartTVs) choke on 204
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
}
if (process.env.HTTPS === "true") {
    https.createServer({
        key: fs.readFileSync('certs/example.com+5-key.pem'),
        cert: fs.readFileSync('certs/example.com+5.pem')
    }, app).listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
} else {
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.get('/', (req, res) => {
    res.send('Hello there! This isn\'t the page you\'re looking for. ⭐🧔⚔️');
});

app.use('/users', usersRoute);
app.use('/questions', questionsRoute);
app.use('/auth', authRoute);
app.use('/categories', categoriesRoute);

app.use((req, res, next) => {
    res.status(404).send('Houston, we have a Problem! (Route not found)');
});

export {app};