/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });

  import React from 'react';
  import { render, fireEvent, waitFor } from '@testing-library/react';
  import JoinNow from './JoinNow';
  
  describe('JoinNow component', () => {
    test('renders the form', () => {
      const { getByText, getByLabelText } = render(<JoinNow />);
      
      expect(getByText('Sign Up')).toBeInTheDocument();
      expect(getByLabelText('Email')).toBeInTheDocument();
      expect(getByLabelText('Password')).toBeInTheDocument();
      expect(getByText('Sign Up')).toBeInTheDocument();
      expect(getByText("Already have an account? Sign In")).toBeInTheDocument();
    });
    
    test('registers a new user when the form is submitted', async () => {
      const mockRegistration = jest.fn(() => Promise.resolve());
      const { getByLabelText, getByText } = render(
        <JoinNow Registration={mockRegistration} />
      );
      
      const emailInput = getByLabelText('Email');
      const passwordInput = getByLabelText('Password');
      const submitButton = getByText('Sign Up');
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'test123' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockRegistration).toHaveBeenCalledWith('test@example.com', 'test123');
      });
    });
  });