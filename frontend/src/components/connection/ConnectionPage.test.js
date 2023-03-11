/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConnectionPage from './ConnectionPage';

describe('ConnectionPage', () => {
  beforeEach(() => {
    // Mock Firebase functions used in the component
    jest.mock('../../firebase', () => ({
      auth: {
        currentUser: {
          uid: 'user123',
        },
      },
      db: {
        collection: jest.fn(() => ({
          doc: jest.fn(() => ({
            get: jest.fn(() =>
              Promise.resolve({
                exists: true,
                data: () => ({
                  connections: ['user456'],
                }),
              })
            ),
            update: jest.fn(),
          })),
        })),
        getDoc: jest.fn(() =>
          Promise.resolve({
            exists: true,
            data: () => ({
              firstName: 'John',
              lastName: 'Doe',
            }),
          })
        ),
      },
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('displays user connections and deletes connection on click', async () => {
    render(<ConnectionPage />);

    // Wait for connections to load
    await waitFor(() => expect(screen.getByText('John Doe')).toBeInTheDocument());

    // Check that connections are displayed
    expect(screen.getByText('My Connections')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Click "Delete Connection" button and check that it disappears
    userEvent.click(screen.getByText('Delete Connection'));
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});