import React from 'react';
import { render } from '@testing-library/react';
import LoggedHomePage from './LoggedHomePage';

describe('LoggedHomePage', () => {
  it('renders the Feed component', () => {
    const { getByTestId } = render(<LoggedHomePage />);
    expect(getByTestId('feed-component')).toBeInTheDocument();
  });
});
