import React from 'react';
import { render, screen } from '@testing-library/react';
import ConnectionPage from './ConnectionPage';

describe('ConnectionPage', () => {
  beforeEach(() => {
    // Mock Firebase auth and db
    jest.mock('../../firebase', () => ({
      auth: {
        currentUser: { uid: 'test-user' },
      },
      db: {},
    }));
  });

  afterEach(() => {
    // Reset Firebase mock
    jest.resetModules();
  });

  it('renders the "My Network" sidebar', () => {
    render(<ConnectionPage />);
    const sidebar = screen.getByRole('navigation');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar).toHaveTextContent('My Network');
    expect(sidebar).toContainHTML('<a href="/connections"><img src="clarity_node.png" alt="node"> Connections</a>');
    expect(sidebar).toContainHTML('<a href="/GroupNetwork"><img src="group.png" alt="node"> Groups</a>');
    expect(sidebar).toContainHTML('<a href="/Event"><img src="event.png" alt="node"> Events</a>');
  });

  it('renders the "Pending Requests" card', () => {
    render(<ConnectionPage />);
    const pendingRequests = screen.getByRole('heading', { name: 'Pending Requests' });
    expect(pendingRequests).toBeInTheDocument();
    expect(pendingRequests.closest('.card')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View all requests' })).toHaveAttribute('href', '/requests');
  });

  it('renders the "My Connections" card with user profiles', async () => {
    // Mock Firebase db collection and documents
    const connectionDoc = { data: () => ({ connections: ['user1', 'user2'] }) };
    const user1Doc = { id: 'user1', data: () => ({ firstName: 'John', lastName: 'Doe', profilePicUrl: 'test.jpg' }) };
    const user2Doc = { id: 'user2', data: () => ({ firstName: 'Jane', lastName: 'Doe' }) };
    jest.mock('firebase/firestore', () => ({
      collection: () => ({
        doc: () => ({
          get: jest.fn().mockResolvedValueOnce(connectionDoc).mockResolvedValueOnce(user1Doc).mockResolvedValueOnce(user2Doc),
          update: jest.fn(),
        }),
      }),
    }));

    render(<ConnectionPage />);
    const connectionsCard = screen.getByRole('heading', { name: 'My Connections' }).closest('.card');
    expect(connectionsCard).toBeInTheDocument();

    // Wait for connections to load
    await screen.findByText('John Doe');
    await screen.findByText('Jane Doe');

    // Check rendered profiles
    const user1Profile = screen.getByRole('img', { name: 'John' });
    expect(user1Profile).toHaveAttribute('src', 'test.jpg');
    const user2Profile = screen.getByRole('img', { name: 'Jane' });
    expect(user2Profile).toHaveAttribute('src', 'test.gif');

    // Test remove button
    const user1RemoveButton = user1Profile.closest('.containRequest').querySelector('button');
    user1RemoveButton.click();
    expect(connectionDoc.data().connections).toEqual(['user2']);
    expect(user1Doc.update).toHaveBeenCalledWith({ connections: [] });
  });
});
