const express = require ('express');
const mongoose = require ('mongoose');
const http = require ('http');
const bodyParser = require ('body-parser');
const logger = require ('morgan');
const indexRouter = require ('../routes/index');


const app = express();

// Подключаем mongoose.
const url = 'mongodb://localhost/ServerDB';
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
  });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection successfully");
});

app.use (express.json());
app.use (bodyParser.urlencoded ({extended: true}));
app.use (bodyParser.json ());

app.use ('/', indexRouter);
app.use (logger ('dev'));




const port = process.env.PORT || 5000;

const server = http.createServer (app);

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});