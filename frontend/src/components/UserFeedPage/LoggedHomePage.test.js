/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});

import React from 'react';
import { render } from '@testing-library/react';
import LoggedHomePage from './LoggedHomePage';
import Feed from './Feed';

describe('LoggedHomePage component', () => {
it('should render a Feed component', () => {
  const { getByTestId } = render(<LoggedHomePage />);
  expect(getByTestId('feed')).toBeInTheDocument();
});
});