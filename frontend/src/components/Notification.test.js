import { render, screen } from '@testing-library/react';
import Notification from './Notification';

jest.mock('../firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid',
    },
  },
  db: {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({
          data: () => ({
            notifications: [
              { message: 'Notification 1', profilePicUrl: 'http://example.com/profile1.png' },
              { message: 'Notification 2', profilePicUrl: 'http://example.com/profile2.png' },
            ],
          }),
        }),
      }),
    }),
  },
}));

describe('Notification component', () => {
  test('renders notification messages', async () => {
    render(<Notification />);
    const notif1 = await screen.findByText('Notification 1');
    const notif2 = await screen.findByText('Notification 2');
    expect(notif1).toBeInTheDocument();
    expect(notif2).toBeInTheDocument();
  });

  test('renders message when there are no notifications', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});

    jest.mock('../firebase', () => ({
      auth: {
        currentUser: {
          uid: 'test-uid',
        },
      },
      db: {
        collection: () => ({
          doc: () => ({
            get: () => Promise.resolve({ data: undefined }),
          }),
        }),
      },
    }));

    render(<Notification />);
    const noNotif = await screen.findByText('No notification recieved');
    expect(noNotif).toBeInTheDocument();
  });
});