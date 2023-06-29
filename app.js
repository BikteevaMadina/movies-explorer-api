require('dotenv').config();
const cors = require('cors');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./src/middlewares/logger');
const rateLimiter = require('./src/utils/rateLimiter');

const router = require('./src/routes/index');

const handleError = require('./src/validation/handleError');
const { PORT, MONGO_URL } = require('./config');

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(requestLogger);
app.use(rateLimiter);
app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App started!\n${MONGO_URL}\nPort: ${PORT}`);
});
