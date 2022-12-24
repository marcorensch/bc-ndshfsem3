import * as dotenv  from 'dotenv';
dotenv.config();
import express from 'express';
import 'babel-polyfill';
import cors from 'cors';
import bodyParser from 'body-parser';
import usersRoute from './routes/users.mjs';
import questionsRoute from './routes/questions.mjs';
import authRoute from './routes/auth.mjs';
import categoriesRoute from './routes/categories.mjs';
import mariadb from 'mariadb';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.use('/users', usersRoute);
app.use('/questions', questionsRoute);
app.use('/auth', authRoute);
app.use('/categories', categoriesRoute);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    res.send('Route not found');
    next(err);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});