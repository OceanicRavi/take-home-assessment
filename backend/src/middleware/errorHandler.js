function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}

module.exports = { notFoundHandler, errorHandler };
