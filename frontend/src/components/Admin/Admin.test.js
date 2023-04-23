import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Admin from './Admin';

describe('Admin component', () => {
  // Mock the firebase functions that are used in the component
  jest.mock('../../firebase', () => ({
    auth: {
      currentUser: {
        email: 'testuser@test.com',
      },
    },
    db: {
      collection: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({
            docs: [
              {
                id: '1',
                data: () => ({
                  job_title: 'Test Job',
                  created_by: 'testuser@test.com',
                  description: 'This is a test job',
                  resume_required: true,
                  cover_letter_required: false,
                  skills: ['React', 'JavaScript'],
                }),
              },
            ],
          }),
        }),
        doc: jest.fn(),
        onSnapshot: jest.fn(),
        getDoc: jest.fn(),
        getDocs: jest.fn(),
        deleteDoc: jest.fn(),
        updateDoc: jest.fn(),
      }),
    },
  }));

  test('renders the job menu block with Job Postings and Advertisements', () => {
    render(<Admin />);
    const jobPostingsLink = screen.getByText('Job Postings');
    expect(jobPostingsLink).toBeInTheDocument();
    const feedPostsLink = screen.getByText('Feed Posts');
    expect(feedPostsLink).toBeInTheDocument();
  });

  test('renders the job postings list when data is loaded', async () => {
    render(<Admin />);
    const jobTitle = await screen.findByText('Test Job');
    expect(jobTitle).toBeInTheDocument();
  });

  test('deletes a job posting when the delete button is clicked', async () => {
    render(<Admin />);
    const deleteButton = await screen.findByTestId('delete-button-1');
    fireEvent.click(deleteButton);
    const confirmationMessage = await screen.findByText('Are you sure you want to delete this post?');
    expect(confirmationMessage).toBeInTheDocument();
    const confirmButton = screen.getByText('OK');
    fireEvent.click(confirmButton);
    expect(db.collection().doc().delete).toHaveBeenCalledWith('1');
  });

  test('saves changes to a job posting when the save button is clicked', async () => {
    render(<Admin />);
    const editButton = await screen.findByTestId('edit-button-1');
    fireEvent.click(editButton);
    const jobTitleInput = await screen.findByLabelText('Job Title');
    fireEvent.change(jobTitleInput, { target: { value: 'New Test Job' } });
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    expect(db.collection().doc().update).toHaveBeenCalledWith('1', {
      job_title: 'New Test Job',
      company: 'Test Company',
      description: 'This is a test job',
      resume_required: true,
      cover_letter_required: false,
      skills: ['React', 'JavaScript'],
    });
  });
});
