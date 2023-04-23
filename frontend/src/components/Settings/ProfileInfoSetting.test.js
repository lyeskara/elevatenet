import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfileInfoSettings from './ProfileInfoSettings';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: jest.fn().mockImplementation(({ children, ...rest }) => <a {...rest}>{children}</a>),
  useNavigate: jest.fn(),
}));

describe('ProfileInfoSettings', () => {
  it('renders the component with the correct elements', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ProfileInfoSettings />
      </BrowserRouter>
    );
    
    expect(getByText('Settings')).toBeInTheDocument();
    expect(getByText('Account Preferences')).toBeInTheDocument();
    expect(getByText('Security')).toBeInTheDocument();
    expect(getByText('Notifications')).toBeInTheDocument();
    expect(getByText('Profile Information')).toBeInTheDocument();
    expect(getByText('Name & location')).toBeInTheDocument();
    expect(getByTestId('arrow')).toBeInTheDocument();
  });
  
  it('navigates to Account Preferences page when clicked', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ProfileInfoSettings />
      </BrowserRouter>
    );
    
    fireEvent.click(getByText('Account Preferences'));
    expect(window.location.href).toBe('/ProfileInfoSettings');
  });
  
  it('navigates to Security page when clicked', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ProfileInfoSettings />
      </BrowserRouter>
    );
    
    fireEvent.click(getByText('Security'));
    expect(window.location.href).toBe('/Security');
  });
  
  it('navigates to Notification Settings page when clicked', () => {
    const { getByText } = render(
      <BrowserRouter>
        <ProfileInfoSettings />
      </BrowserRouter>
    );
    
    fireEvent.click(getByText('Notifications'));
    expect(window.location.href).toBe('/NotificationSettings');
  });
});
