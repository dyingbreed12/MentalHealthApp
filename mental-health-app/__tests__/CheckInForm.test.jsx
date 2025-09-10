// File: mental-health-app/__tests__/CheckInForm.test.jsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CheckInForm } from '../app/components/CheckInForm.jsx';
import { submitCheckIn } from '../app/lib/api.js';

// Mock the API call
vi.mock('../app/lib/api.js', () => ({
  submitCheckIn: vi.fn(),
}));

describe('CheckInForm', () => {
  it('submits the form with correct data and resets', async () => {
    // Arrange
    submitCheckIn.mockResolvedValue({});
    const mockOnSubmit = vi.fn();

    render(<CheckInForm onCheckInSubmitted={mockOnSubmit} />);

    // Get form elements
    const moodInput = screen.getByLabelText(/Mood/i);
    const notesTextarea = screen.getByLabelText(/Notes/i);
    const submitButton = screen.getByRole('button', { name: /Submit Check-in/i });

    // Act
    fireEvent.change(moodInput, { target: { value: '4' } });
    fireEvent.change(notesTextarea, { target: { value: 'Feeling good!' } });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      // The test no longer expects userId to be in the request body.
      expect(submitCheckIn).toHaveBeenCalledWith({ mood: 4, notes: 'Feeling good!' });

      expect(mockOnSubmit).toHaveBeenCalled();

      expect(moodInput).toHaveValue(3);
      expect(notesTextarea).toHaveValue('');
    });
  });
});