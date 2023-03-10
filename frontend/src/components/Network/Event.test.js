import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from './Event';


describe('Event', () => {
    it('renders a list of event postings', async () => {
      // Mock the Firebase Firestore data
      const mockPostingData = [
        { id: '1', event_title: 'Interview', event_type: 'Online', description: 'Event organized with Google' },
        { id: '2', event_title: 'Networking', event_type: 'In Person', description: 'Event organized with Amazon' },
      ];
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockPostingData),
        })
      );
  
      // Render the component
      render(<Event />);
  
      // Check that the event postings are displayed
      expect(await screen.findByText('Interview')).toBeInTheDocument();
      expect(screen.getByText('Online')).toBeInTheDocument();
      expect(screen.getByText('Event organized with Google')).toBeInTheDocument();
      expect(screen.getByText('Event organized with Amazon')).toBeInTheDocument();
      expect(screen.getByText('Networking')).toBeInTheDocument();
      expect(screen.getByText('In Person')).toBeInTheDocument();
  
      // Restore the fetch method
      global.fetch.mockRestore();
    });
  
    it('redirects to the CreateEvent page when the "Create an event" button is clicked', () => {
      // Mock the window location
      delete window.location;
      window.location = { href: '' };
  
      // Render the component
      render(<Event />);
  
      // Click the "Create a New Job Posting" button
      const button = screen.getByText('Create New Event');
      userEvent.click(button);
  
      // Check that the window location has changed
      expect(window.location.href).toBe('/CreateEvent');
    });
  })