export default function LoadingSpinner() {
  return (
    <div className="spinner-container" role="status" aria-label="Loading">
      <div className="spinner" />
      <span>Loading telemetry data...</span>
    </div>
  );
}
