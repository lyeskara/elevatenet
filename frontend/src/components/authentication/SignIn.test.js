/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SignIn from './SignIn';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom')), // since you still want to use the actual MemoryRouter
  useNavigate: () => mockedUsedNavigate,
}))

jest.mock('../../context/UserAuthContext', () => {
  return {
    useUserAuth: () => {
      return {
        Login: jest.fn(async (email, password) => {
          if (email === 'test@example.com' && password === 'password') {
            return Promise.resolve();
          }
          return Promise.reject(new Error('Invalid credentials'));
        }),
      };
    },
  };
});

describe('SignIn', () => {
  it('should call the login function with the correct credentials', async () => {
    const { getByLabelText, getByText } = render(<SignIn />);
    const emailInput = getByLabelText('Email:');
    const passwordInput = getByLabelText('Password:');
    const submitButton = getByText('Agree & Join');

    fireEvent.change(emailInput, { target: { value: 'lyes@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: '123456789' } });
    fireEvent.click(submitButton);

    const { Login } = require('../../context/UserAuthContext');
    expect(Login).toHaveBeenCalledWith('lyes@gmail.com', '123456789');
    await expect(Login).resolves;
  });

  it('should not call the login function with incorrect credentials', async () => {
    const { getByLabelText, getByText } = render(<SignIn/>);
    const emailInput = getByLabelText('Email:');
    const passwordInput = getByLabelText('Password:');
    const submitButton = getByText('Agree & Join');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    const { Login } = require('../../context/UserAuthContext');
    expect(Login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    await expect(Login).rejects.toThrowError('Invalid credentials');
  });
});
