import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import NotificationSettings from './Notificationsettings';

// Mocking Firebase methods
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
}));
jest.mock('../../firebase', () => ({
  auth: {
    currentUser: {
      uid: 'user123',
    },
  },
  db: {},
}));

describe('NotificationSettings', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { getByText, getByLabelText } = render(<NotificationSettings />);
    expect(getByText('Settings')).toBeInTheDocument();
    expect(getByText('Account Preferences')).toBeInTheDocument();
    expect(getByText('Security')).toBeInTheDocument();
    expect(getByText('Notifications')).toBeInTheDocument();
    expect(getByLabelText('Receive notifications for DMs')).toBeInTheDocument();
    expect(getByLabelText('Receive notifications for Newsfeed')).toBeInTheDocument();
  });

  it('should fetch the user settings on mount', async () => {
    const mockData = { data: () => ({ dm: true, feed: false }) };
    getDoc.mockResolvedValue(mockData);

    render(<NotificationSettings />);

    await waitFor(() => expect(getDoc).toHaveBeenCalledWith(doc(collection(db, 'notification_settings'), 'user123')));
    expect(setDoc).not.toHaveBeenCalled();
  });

  it('should update the DM notifications setting', async () => {
    const mockData = { data: () => ({ dm: false, feed: true }) };
    getDoc.mockResolvedValue(mockData);

    const { getByLabelText } = render(<NotificationSettings />);

    const dmNotifications = getByLabelText('Receive notifications for DMs');
    fireEvent.click(dmNotifications);

    await waitFor(() => expect(setDoc).toHaveBeenCalledWith(doc(collection(db, 'notification_settings'), 'user123'), { dm: true, feed: true }));
    expect(updateDoc).toHaveBeenCalledWith(doc(collection(db, 'notification_settings'), 'user123'), { dm: true, feed: true });
  });

  it('should update the newsfeed notifications setting', async () => {
    const mockData = { data: () => ({ dm: false, feed: true }) };
    getDoc.mockResolvedValue(mockData);

    const { getByLabelText } = render(<NotificationSettings />);

    const newsfeedNotifications = getByLabelText('Receive notifications for Newsfeed');
    fireEvent.click(newsfeedNotifications);

    await waitFor(() => expect(setDoc).toHaveBeenCalledWith(doc(collection(db, 'notification_settings'), 'user123'), { dm: false, feed: false }));
    expect(updateDoc).toHaveBeenCalledWith(doc(collection(db, 'notification_settings'), 'user123'), { dm: false, feed: false });
  });

  it('should redirect to Account Preferences page on click', () => {
    const { getByText } = render(<NotificationSettings />);

    const accountPreferences = getByText('Account Preferences');
    fireEvent.click(accountPreferences);

    expect(window.location.href).toBe('/ProfileInfoSettings');
  });

  it('should redirect to Security page on click', () => {
    const { getByText } = render(<NotificationSettings />);

    const security = getByText('Security');
    fireEvent.click(security);

    expect(window.location.href).toBe('/Security');
  });
});