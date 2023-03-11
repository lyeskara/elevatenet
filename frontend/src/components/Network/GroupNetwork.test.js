/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });
  
  import React from 'react';
  import { render } from '@testing-library/react';
  import GroupNetwork from './GroupNetwork';
  
  describe('GroupNetwork', () => {
    it('renders "My Groups" section', () => {
      const { getByText } = render(<GroupNetwork />);
      expect(getByText('My Groups')).toBeInTheDocument();
    });
  
    it('renders "Groups You May Like" section', () => {
      const { getByText } = render(<GroupNetwork />);
      expect(getByText('Groups You May Like')).toBeInTheDocument();
    });
  
    it('renders "Create New Group" button', () => {
      const { getByText } = render(<GroupNetwork />);
      expect(getByText('Create New Group')).toBeInTheDocument();
    });
  });
  