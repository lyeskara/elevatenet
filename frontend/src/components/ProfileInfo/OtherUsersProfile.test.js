/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });
  
  import React from 'react';
  import { render, screen } from '@testing-library/react';
  import OtherUsersProfile from './OtherUsersProfile';

test('renders OtherUsersProfile without errors', () => {
  render(<OtherUsersProfile />);
});
  
  describe('OtherUsersProfile', () => {
    const user = {
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Some bio',
      education: 'Some education',
      workExperience: 'Some work experience',
      skills: 'Some skills',
      languages: 'Some languages',
    };
    const params = { id: 'some-id' };
    
    beforeEach(() => {
      jest.clearAllMocks();
    });
    
    test('renders user information', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: async () => ({ data: user }),
      });
      render(<OtherUsersProfile match={{ params }} />);
      
      expect(await screen.findByText(`${user.firstName} ${user.lastName}`)).toBeInTheDocument();
      expect(await screen.findByText(user.bio)).toBeInTheDocument();
      expect(await screen.findByText(user.education)).toBeInTheDocument();
      expect(await screen.findByText(user.workExperience)).toBeInTheDocument();
      expect(await screen.findByText(user.skills)).toBeInTheDocument();
      expect(await screen.findByText(user.languages)).toBeInTheDocument();
    });
  
    test('renders error message when user information not found', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({ json: async () => ({}) });
      render(<OtherUsersProfile match={{ params }} />);
      
      expect(await screen.findByText('Error')).toBeInTheDocument();
    });
  });