import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { updatePassword } from 'firebase/auth';
import { collection, getDoc, doc } from 'firebase/firestore';
import { act } from 'react-dom/test-utils';
import ChangePassword from './ChangePassword';

jest.mock('firebase/auth', () => ({
  updatePassword: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
}));

describe('ChangePassword component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('updates password when button is clicked', async () => {
    const mockUserDoc = {
      exists: true,
      data: () => ({
        email: 'user@example.com',
      }),
    };
    const mockGetDoc = jest.fn(() => Promise.resolve(mockUserDoc));
    getDoc.mockImplementation(mockGetDoc);
    updatePassword.mockImplementation(() => Promise.resolve());

    await act(async () => {
      render(<ChangePassword />);
    });

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const changePasswordButton = screen.getByRole('button', {
      name: /change password/i,
    });

    fireEvent.change(newPasswordInput, { target: { value: 'newpassword' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'newpassword' },
    });
    fireEvent.click(changePasswordButton);

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledTimes(1);
      expect(updatePassword).toHaveBeenCalledWith(
        expect.any(Object),
        'newpassword'
      );
      expect(mockGetDoc).toHaveBeenCalledTimes(1);
      expect(mockGetDoc).toHaveBeenCalledWith(
        doc(collection(), 'users_information', expect.any(String))
      );
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });
});
