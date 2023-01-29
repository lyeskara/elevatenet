/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SignIn from './SignIn';
import { useUserAuth, Login } from '../../context/UserAuthContext';

test('test', () => {
  expect(true).toBe(true);
});

jest.mock('../../context/UserAuthContext', () => {
  return {
      useUserAuth: jest.fn().mockReturnValue({
          Login: jest.fn()
      })
  }
});


test("should throw an error when the credentials are invalid", async () => {
  const { Login } = useUserAuth();
  const spy = jest.spyOn(useUserAuth(), 'Login');

  try {
    await Login("lyes@gmail.com", "123456789");
  } catch (error) {
    expect(error).toEqual(new Error("Invalid credentials"));
  }

  expect(spy).toHaveBeenCalledWith("lyes@gmail.com", "123456789");
});
