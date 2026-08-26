import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TelemetryForm from '../TelemetryForm';

describe('TelemetryForm', () => {
  it('shows validation errors and does not submit when fields are empty', () => {
    const onSubmit = vi.fn();
    render(<TelemetryForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText('Add Entry'));

    expect(screen.getByText('Satellite ID is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('rejects a negative altitude', () => {
    const onSubmit = vi.fn();
    render(<TelemetryForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Satellite ID'), { target: { value: 'SAT-9' } });
    fireEvent.change(screen.getByLabelText('Timestamp'), {
      target: { value: '2026-08-25T10:00' },
    });
    fireEvent.change(screen.getByLabelText(/Altitude/), { target: { value: '-5' } });
    fireEvent.change(screen.getByLabelText(/Velocity/), { target: { value: '7.5' } });

    fireEvent.click(screen.getByText('Add Entry'));

    expect(screen.getByText('Altitude must be a positive number')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a valid entry with an ISO timestamp', async () => {
    const onSubmit = vi.fn();
    render(<TelemetryForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Satellite ID'), { target: { value: 'SAT-9' } });
    fireEvent.change(screen.getByLabelText('Timestamp'), {
      target: { value: '2026-08-25T10:00' },
    });
    fireEvent.change(screen.getByLabelText(/Altitude/), { target: { value: '500' } });
    fireEvent.change(screen.getByLabelText(/Velocity/), { target: { value: '7.5' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Add Entry'));
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const submitted = onSubmit.mock.calls[0][0];
    expect(submitted.satelliteId).toBe('SAT-9');
    expect(submitted.altitude).toBe(500);
    expect(submitted.velocity).toBe(7.5);
    expect(() => new Date(submitted.timestamp).toISOString()).not.toThrow();
  });
});
