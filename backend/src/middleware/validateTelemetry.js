// ISO 8601 datetime check via Date parsing plus a format guard, since
// `new Date('garbage')` still needs the string to look date-like first.
const ISO_8601_REGEX =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;

function isValidIsoTimestamp(value) {
  return typeof value === 'string' && ISO_8601_REGEX.test(value) && !Number.isNaN(Date.parse(value));
}

function isPositiveNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function validateTelemetry(req, res, next) {
  const { satelliteId, timestamp, altitude, velocity, status } = req.body;
  const errors = [];

  if (typeof satelliteId !== 'string' || satelliteId.trim() === '') {
    errors.push('satelliteId is required and must be a non-empty string');
  }

  if (!isValidIsoTimestamp(timestamp)) {
    errors.push('timestamp is required and must be a valid ISO 8601 datetime');
  }

  if (!isPositiveNumber(altitude)) {
    errors.push('altitude is required and must be a positive number');
  }

  if (!isPositiveNumber(velocity)) {
    errors.push('velocity is required and must be a positive number');
  }

  if (typeof status !== 'string' || status.trim() === '') {
    errors.push('status is required and must be a non-empty string');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
}

module.exports = { validateTelemetry, isValidIsoTimestamp, isPositiveNumber };
