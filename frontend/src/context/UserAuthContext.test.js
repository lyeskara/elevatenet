import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { UserAuthContextProvider, useUserAuth } from './UserAuthContext';

describe('UserAuthContextProvider', () => {
  test('Login function should sign in a user with email and password', async () => {
    const email = 'testuser@test.com';
    const password = 'testpassword';

    const { getByTestId } = render(
      <UserAuthContextProvider>
        <LoginForm />
      </UserAuthContextProvider>
    );

    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const submitButton = getByTestId('submit-button');

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const { user } = useUserAuth();
      expect(user).not.toBeNull();
      expect(user.email).toEqual(email);
    });
  });
});

function LoginForm() {
  const { Login } = useUserAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      await Login(email.value, password.value);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email-input">Email:</label>
      <input type="email" id="email-input" data-testid="email-input" />
      <label htmlFor="password-input">Password:</label>
      <input type="password" id="password-input" data-testid="password-input" />
      <button type="submit" data-testid="submit-button">Log in</button>
    </form>
  );
}
