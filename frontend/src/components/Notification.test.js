import React from 'react';
import { render, screen } from '@testing-library/react';
import Notification from './Notification';

// Mock Firebase functions
jest.mock('../firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid'
    }
  },
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({
          data: jest.fn(() => ({
            notifications: [
              {
                profilePicUrl: 'test-url',
                message: 'test-message'
              }
            ]
          }))
        }))
      }))
    }))
  }
}));

describe('Notification', () => {
  it('renders a notification card', async () => {
    render(<Notification />);

    // Wait for Firebase data to be fetched and state to be updated
    await screen.findByText(/Notification Center/);

    // Expect to find notification card with test data
    expect(screen.getByAltText(/profilephoto-icon/)).toHaveAttribute('src', 'test-url');
    expect(screen.getByText('test-message')).toBeInTheDocument();
  });

  it('renders a "no notification received" message', async () => {
    // Mock empty data returned from Firebase
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn(() => ({
        data: undefined
      }))
    });

    render(<Notification />);

    // Wait for Firebase data to be fetched and state to be updated
    await screen.findByText(/Notification Center/);

    // Expect to find "no notification received" message
    expect(screen.getByText(/no notification received/i)).toBeInTheDocument();
  });
});
