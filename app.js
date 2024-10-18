const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/api', indexRouter);

const mongoURI = 'mongodb://localhost:27017/todolist-test';

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
