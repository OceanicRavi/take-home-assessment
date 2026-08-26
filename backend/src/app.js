const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const telemetryRouter = require('./routes/telemetry');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/telemetry', telemetryRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
