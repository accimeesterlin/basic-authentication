const express = require('express');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const morgan = require('morgan');
const log = console.log;
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 8080;

// command + shift + p
// ctrl + shift + p

// attach node process

// REST API


app.use(express.urlencoded({
    extended: true // encoder
}));

app.use(cookieParser()); // configure cookie parser
app.use(express.json());
app.use('/', htmlRoutes);
app.use('/api', apiRoutes);
app.use(morgan());


app.listen(PORT, () => {
    log('Server is starting at port ', PORT);
});