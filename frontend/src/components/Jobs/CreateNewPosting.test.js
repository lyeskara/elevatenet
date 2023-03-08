/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });

  import React from 'react';
  import { render, fireEvent, screen } from '@testing-library/react';
  import CreateNewPosting from './CreateNewPosting';
  
  describe('CreateNewPosting component', () => {
    test('cancel button works', () => {
      // mock the functions needed for the component
      const handleSubmitMock = jest.fn();
      const handleCancelMock = jest.fn();
  
      // render the component
      render(<CreateNewPosting handleSubmit={handleSubmitMock} handleCancel={handleCancelMock} />);
  
      // click the cancel button
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
  
      // verify that the handleCancel function was called
      expect(handleCancelMock).toHaveBeenCalled();
    });
  });
