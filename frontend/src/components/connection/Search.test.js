
/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });
import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import Search from './Search';

// mock the Firebase dependencies used by the component
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
  it('should render a search input and a list of search results', async () => {
    // render the component
    render(<Search />);

    // get the search input and type a search query
    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    // wait for the component to update with the search results
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // assert that the Firestore query was called with the correct arguments
    expect(db.collection).toHaveBeenCalledWith('users_information');
    expect(db.collection().where).toHaveBeenCalledWith('firstName', '==', 'John');

    // assert that the search results are displayed as links
    const searchResults = screen.getAllByRole('listitem');
    expect(searchResults).toHaveLength(0); // since we mocked the Firestore results as empty

    // assert that clicking on a search result navigates to the correct profile page
    const profileLink = screen.getByRole('link');
    fireEvent.click(profileLink);
    expect(window.location.pathname).toBe('/profile/:id'); // replace :id with the mocked user ID
  });
});