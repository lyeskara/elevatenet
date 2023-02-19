import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobPostings from './JobPostings';

describe('JobPostings', () => {
  it('renders a list of job postings', async () => {
    // Mock the Firebase Firestore data
    const mockPostingData = [
      { id: '1', job_title: 'Software Engineer', company: 'Acme Corp', description: 'We are looking for a talented software engineer to join our team.' },
      { id: '2', job_title: 'Data Scientist', company: 'Globex Corp', description: 'We are seeking a data scientist to help us make sense of our data.' },
    ];
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPostingData),
      })
    );

    // Render the component
    render(<JobPostings />);

    // Check that the job postings are displayed
    expect(await screen.findByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('We are looking for a talented software engineer to join our team.')).toBeInTheDocument();
    expect(screen.getByText('Data Scientist')).toBeInTheDocument();
    expect(screen.getByText('Globex Corp')).toBeInTheDocument();
    expect(screen.getByText('We are seeking a data scientist to help us make sense of our data.')).toBeInTheDocument();

    // Restore the fetch method
    global.fetch.mockRestore();
  });

  it('redirects to the CreateNewPosting page when the "Create a New Job Posting" button is clicked', () => {
    // Mock the window location
    delete window.location;
    window.location = { href: '' };

    // Render the component
    render(<JobPostings />);

    // Click the "Create a New Job Posting" button
    const button = screen.getByText('Create a New Job Posting');
    userEvent.click(button);

    // Check that the window location has changed
    expect(window.location.href).toBe('/CreateNewPosting');
  });
})
