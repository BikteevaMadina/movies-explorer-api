require('dotenv').config();
const cors = require('cors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./src/middlewares/logger');
const rateLimiter = require('./src/utils/rateLimiter');

const router = require('./src/routes/index');

const {
  MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  PORT = 3000,
} = process.env;

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(requestLogger);
app.use(rateLimiter);
app.use('/', router);
app.use(errorLogger);
app.use(errors());

app.use((error, request, response, next) => {
  const {
    status = 500,
    message,
  } = error;
  response.status(status)
    .send({
      message: status === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

async function start() {
  mongoose.set('strictQuery', false);
  try {
    await mongoose.connect(MONGO_URL);
    await app.listen(PORT);
  } catch (err) {
    console.log(err);
  }
}

start()
  .then(() => console.log(`App started!\n${MONGO_URL}\nPort: ${PORT}`));
