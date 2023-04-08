import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Advertisements from './Advertisements';

describe('Advertisements component', () => {
  test('renders job menu and title', async () => {
    render(<Advertisements />);

    // Check if the job menu block is displayed
    const jobMenu = screen.getByRole('heading', { name: /jobs/i });
    expect(jobMenu).toBeInTheDocument();

    // Check if the "Advertisements" text is displayed
    const advertisementsText = screen.getByRole('heading', { name: /advertisements/i });
    expect(advertisementsText).toBeInTheDocument();

    // Check if the "Your Advertisements" title is displayed
    const yourAdvertisementsTitle = await screen.findByRole('heading', { name: /your advertisements/i });
    expect(yourAdvertisementsTitle).toBeInTheDocument();
  });

  test('displays job postings data', async () => {
    // Mock the getDocs function to return some job postings
    jest.spyOn(window, 'getDocs').mockResolvedValueOnce({
      docs: [
        {
          id: '1',
          data: () => ({
            job_title: 'Test Job 1',
            company: 'Test Company 1',
            description: 'Test Description 1',
            resume_required: false,
            cover_letter_required: true,
            skills: ['skill1', 'skill2'],
          }),
        },
        {
          id: '2',
          data: () => ({
            job_title: 'Test Job 2',
            company: 'Test Company 2',
            description: 'Test Description 2',
            resume_required: true,
            cover_letter_required: false,
            skills: ['skill3', 'skill4'],
          }),
        },
      ],
    });

    render(<Advertisements />);

    // Check if the job postings data is displayed
    const jobTitle1 = await screen.findByText('Test Job 1');
    expect(jobTitle1).toBeInTheDocument();
    const jobTitle2 = await screen.findByText('Test Job 2');
    expect(jobTitle2).toBeInTheDocument();
  });

  test('opens and closes modal on "Edit" button click', async () => {
    // Mock the getDocs function to return some job postings
    jest.spyOn(window, 'getDocs').mockResolvedValueOnce({
      docs: [
        {
          id: '1',
          data: () => ({
            job_title: 'Test Job 1',
            company: 'Test Company 1',
            description: 'Test Description 1',
            resume_required: false,
            cover_letter_required: true,
            skills: ['skill1', 'skill2'],
          }),
        },
      ],
    });

    render(<Advertisements />);

    // Wait for job postings data to be displayed
    const jobTitle1 = await screen.findByText('Test Job 1');

    // Click "Edit" button and check if the modal is displayed
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    const modalTitle = await screen.findByText('Edit Advertisement');
    expect(modalTitle).toBeInTheDocument();

    // Close modal and check if it's no longer displayed
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText('Edit Advertisement')).not.toBeInTheDocument();
    });
  });
});
