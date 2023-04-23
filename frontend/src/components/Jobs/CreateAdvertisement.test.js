import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { UserAuthProvider } from '../../context/UserAuthContext';
import CreateAdvertisements from './CreateAdvertisements';

describe('CreateAdvertisements', () => {
  test('renders job posting form', () => {
    render(
      <UserAuthProvider>
        <CreateAdvertisements />
      </UserAuthProvider>
    );

    expect(screen.getByText(/create a new job posting/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/apply here/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deadline/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/resume required/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cover letter required/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/skills/i)).toBeInTheDocument();
  });

  test('submits job posting form', async () => {
    const mockAddDoc = jest.fn();
    const mockNavigate = jest.fn();
    jest.mock('firebase/firestore', () => ({
      collection: () => ({
        addDoc: mockAddDoc
      }),
      doc: () => ({
        getDoc: jest.fn(() => Promise.resolve({ exists: true, get: () => 'user@example.com' }))
      })
    }));
    jest.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate
    }));

    render(
      <UserAuthProvider value={{ user: { uid: '123' } }}>
        <CreateAdvertisements />
      </UserAuthProvider>
    );

    const jobTitleInput = screen.getByLabelText(/job title/i);
    const companyInput = screen.getByLabelText(/company/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const applyHereInput = screen.getByLabelText(/apply here/i);
    const deadlineInput = screen.getByLabelText(/deadline/i);
    const resumeRequiredCheckbox = screen.getByLabelText(/resume required/i);
    const coverLetterRequiredCheckbox = screen.getByLabelText(/cover letter required/i);
    const skillsInput = screen.getByLabelText(/skills/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(jobTitleInput, { target: { value: 'Software Engineer' } });
    fireEvent.change(companyInput, { target: { value: 'Example Corp' } });
    fireEvent.change(descriptionInput, { target: { value: 'A software engineer job description' } });
    fireEvent.change(applyHereInput, { target: { value: 'https://example.com/apply' } });
    fireEvent.change(deadlineInput, { target: { value: '2024-01-01' } });
    fireEvent.click(resumeRequiredCheckbox);
    fireEvent.click(coverLetterRequiredCheckbox);
    fireEvent.change(skillsInput, { target: { value: 'JavaScript,React,Node.js' } });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockAddDoc).toHaveBeenCalledWith('advertisement', {
      job_title: 'Software Engineer',
      company: 'Example Corp',
      description: 'A software engineer job description',
      apply_here: 'https://example.com/apply',
      deadline: '2024-01-01T00:00:00.000Z',
      created_by: 'user@example.com',
      resume_required: true,
      cover_letter_required: true,
      skills: ['JavaScript', 'React', 'Node.js']
    });
    expect(mockNavigate).toHaveBeenCalledWith('/JobPostings');
  });
});
