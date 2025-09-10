// File: mental-health-app/__tests__/CheckInForm.test.js

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
// Corrected import path for CheckInForm
import { CheckInForm } from '../app/components/CheckInForm';
// Corrected import path for the API
import { submitCheckIn } from '../app/lib/api';

// Corrected mock path to match the import path
vi.mock('../app/lib/api', () => ({
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
      // 1. Verify that the submit function was called with the correct data
      expect(submitCheckIn).toHaveBeenCalledWith({ mood: 4, notes: 'Feeling good!', userId: 1 });

      // 2. Verify that the callback was triggered to refresh the parent component
      expect(mockOnSubmit).toHaveBeenCalled();

      // 3. Verify that the form inputs were reset
      expect(moodInput).toHaveValue(3);
      expect(notesTextarea).toHaveValue('');
    });
  });
});