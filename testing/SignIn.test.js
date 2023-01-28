import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import SignIn from './SignIn'
import { UserAuthProvider } from '../../context/UserAuthContext'
import { auth } from '../../firebase'

jest.mock('../../context/UserAuthContext', () => {
  return {
    useUserAuth: jest.fn(() => {
      return {
        Login: jest.fn()
      }
    })
  }
})

jest.mock('../../firebase', () => {
  return {
    auth: {
      signInWithEmailAndPassword: jest.fn()
    }
  }
})

describe('SignIn', () => {
  test('sign in form submission', async () => {
    const { getByLabelText, getByText } = render(
      <UserAuthProvider>
        <SignIn />
      </UserAuthProvider>
    )
    const emailInput = getByLabelText(/email/i)
    const passwordInput = getByLabelText(/password/i)
    const submitButton = getByText(/agree & join/i)

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })
})
