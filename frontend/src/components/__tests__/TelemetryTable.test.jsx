import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TelemetryTable from '../TelemetryTable';

const entries = [
  {
    id: '1',
    satelliteId: 'SAT-001',
    timestamp: '2026-08-24T10:00:00Z',
    altitude: 500,
    velocity: 7.6,
    status: 'healthy',
  },
  {
    id: '2',
    satelliteId: 'SAT-002',
    timestamp: '2026-08-24T09:00:00Z',
    altitude: 300,
    velocity: 7.8,
    status: 'critical',
  },
];

describe('TelemetryTable', () => {
  it('renders a row per entry', () => {
    render(<TelemetryTable entries={entries} onDelete={() => {}} />);
    expect(screen.getByText('SAT-001')).toBeInTheDocument();
    expect(screen.getByText('SAT-002')).toBeInTheDocument();
  });

  it('shows an empty state message when there are no entries', () => {
    render(<TelemetryTable entries={[]} onDelete={() => {}} />);
    expect(screen.getByText(/no telemetry entries/i)).toBeInTheDocument();
  });

  it('calls onDelete with the entry id when Delete is clicked', () => {
    const onDelete = vi.fn();
    render(<TelemetryTable entries={entries} onDelete={onDelete} />);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('sorts by altitude when the column header is clicked', () => {
    render(<TelemetryTable entries={entries} onDelete={() => {}} />);
    fireEvent.click(screen.getByText(/Altitude/));
    const rows = screen.getAllByRole('row').slice(1); // skip header row
    expect(rows[0]).toHaveTextContent('SAT-002'); // 300 < 500, ascending first
  });
});
