/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });
  
  import React from 'react';
  import { render } from '@testing-library/react';
  import Event from './Event';
  
  describe('Event component', () => {
    it('renders without crashing', () => {
      render(<Event />);
    });
  
    it('displays the "Create New Event" button', () => {
      const { getByText } = render(<Event />);
      const buttonElement = getByText(/Create New Event/i);
      expect(buttonElement).toBeInTheDocument();
    });
  });
  