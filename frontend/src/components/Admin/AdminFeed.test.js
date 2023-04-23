import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { collection, getDocs, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import AdminFeed from './AdminFeed';

// Mock the Firebase methods that are used in AdminFeed
jest.mock('../../firebase', () => ({
  auth: {
    currentUser: {
      uid: '361FbyTxmmZqCT03kGd25kSyDff1'
    }
  },
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
    getDocs: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn()
  }
}));

describe('AdminFeed', () => {
  it('should render feed posts when user is an admin', async () => {
    // Set up the mocked Firebase methods to return some data
    const mockedData = {
      id: '12345',
      data: () => ({
        posts: [{
          id: '67890',
          post_text: 'Hello world',
          created_by: 'John Doe'
        }]
      })
    };
    db.collection.mockReturnValue({
      getDocs: jest.fn().mockResolvedValue({
        docs: [mockedData]
      })
    });
    db.doc.mockReturnValue({
      getDoc: jest.fn().mockResolvedValue(mockedData),
      updateDoc: jest.fn().mockResolvedValue(),
      deleteDoc: jest.fn().mockResolvedValue()
    });

    // Render AdminFeed component
    render(<AdminFeed />);

    // Wait for the async data fetching and rendering to complete
    await waitFor(() => {
      expect(screen.getByText('12345')).toBeInTheDocument();
      expect(screen.getByText('Created by: John Doe')).toBeInTheDocument();
      expect(screen.getByText('Hello world')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    // Test delete functionality
    userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(db.doc).toHaveBeenCalledWith(db, 'user_posts', '12345');
    expect(db.doc().updateDoc).toHaveBeenCalledWith({ posts: [] });
    expect(screen.queryByText('Hello world')).not.toBeInTheDocument();
  });

  it('should show error message when user is not an admin', async () => {
    // Set up the mocked Firebase methods to return null currentUser
    auth.currentUser = null;

    // Render AdminFeed component
    render(<AdminFeed />);

    // Wait for the async rendering to complete
    await waitFor(() => {
      expect(screen.getByText('You do not have permission to view this page.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Go to back to main page' })).toBeInTheDocument();
    });
  });
});
