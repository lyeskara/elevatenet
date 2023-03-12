/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });

  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import RequestSent from './RequestSent';
  
  describe('RequestSent', () => {
    test('renders a title', () => {
      render(<RequestSent />);
      const titleElement = screen.getByText('Manage Invitations');
      expect(titleElement).toBeInTheDocument();
    });
  
    test('displays user data', async () => {
      // TODO: mock Firebase calls and set up test data
      render(<RequestSent />);
      const firstNameElement = await screen.findByText('John');
      const lastNameElement = await screen.findByText('Doe');
      expect(firstNameElement).toBeInTheDocument();
      expect(lastNameElement).toBeInTheDocument();
    });
  
    test('handles connect button click', () => {
      // TODO: mock Firebase calls and set up test data
      render(<RequestSent />);
      const connectButton = screen.getByText('Connect');
      connectButton.click();
      // TODO: expect appropriate changes to state or database
    });
  
    test('handles cancel button click', () => {
      // TODO: mock Firebase calls and set up test data
      render(<RequestSent />);
      const cancelButton = screen.getByText('Cancel');
      cancelButton.click();
      // TODO: expect appropriate changes to state or database
    });
  
    test('handles withdraw button click', () => {
      // TODO: mock Firebase calls and set up test data
      render(<RequestSent />);
      const withdrawButton = screen.getByText('Withdraw');
      withdrawButton.click();
      // TODO: expect appropriate changes to state or database
    });
  });
  