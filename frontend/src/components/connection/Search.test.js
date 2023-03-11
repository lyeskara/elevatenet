
/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Search from './Search';
import { db } from '../../firebase';

jest.mock('../../firebase', () => ({
  db: {
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ docs: [] })),
      })),
    })),
  },
}));

describe('Search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should search for users based on input value', async () => {
    const { getByPlaceholderText, getAllByRole } = render(<Search />);
    const input = getByPlaceholderText('Search...');

    fireEvent.change(input, { target: { value: 'John' } });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(db.collection).toHaveBeenCalledTimes(1);
    expect(db.collection).toHaveBeenCalledWith('users_information');
    expect(db.collection().where).toHaveBeenCalledTimes(1);
    expect(db.collection().where).toHaveBeenCalledWith('firstName', '==', 'John');

    const searchResults = getAllByRole('listitem');

    expect(searchResults).toHaveLength(0); // no results since we mocked the Firestore results as empty
  });
});
