/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });
  
  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import PendingRequests from './PendingRequests';
  
  describe('PendingRequests', () => {
    test('renders the manage invitations title', () => {
      render(<PendingRequests />);
      const titleElement = screen.getByText(/Manage Invitations/i);
      expect(titleElement).toBeInTheDocument();
    });
  
    test('renders the backward arrow image', () => {
      render(<PendingRequests />);
      const imgElement = screen.getByAltText(/back/i);
      expect(imgElement).toBeInTheDocument();
    });
  
    test('renders the container with the correct class name', () => {
      render(<PendingRequests />);
      const containerElement = screen.getByTestId('pending-requests-container');
      expect(containerElement).toHaveClass('contain');
    });
  });
  