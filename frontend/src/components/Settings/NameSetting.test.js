import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import NameSetting from './NameSetting';

describe('NameSetting component', () => {
  test('renders the form with default user information', async () => {
    const { getByLabelText, getByText } = render(<NameSetting />);
    expect(getByLabelText('First Name').value).toBe('');
    expect(getByLabelText('Last Name').value).toBe('');
    expect(getByLabelText('Location').value).toBe('');
    expect(getByLabelText('Contact Number').value).toBe('');
    expect(getByText('Save Changes')).toBeInTheDocument();
  });

  test('updates user information and shows success message', async () => {
    const { getByLabelText, getByText, getByTestId } = render(<NameSetting />);
    fireEvent.change(getByLabelText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByLabelText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByLabelText('Location'), { target: { value: 'New York' } });
    fireEvent.change(getByLabelText('Contact Number'), { target: { value: '1234567890' } });
    fireEvent.click(getByText('Save Changes'));
    await waitFor(() => expect(getByTestId('success-message')).toBeInTheDocument());
  });
});

