const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Satellite telemetry API listening on port ${PORT}`);
});
