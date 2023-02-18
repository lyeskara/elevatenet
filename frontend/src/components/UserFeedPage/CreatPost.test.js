import React from 'react';
import { render, fireEvent,getByLabelText, getByText } from '@testing-library/react';
import CreatPost from './CreatPost';
import { MemoryRouter } from 'react-router-dom';


test('submit post with title, post text and picture', () => {
    const { getByLabelText, getByText} = render(<MemoryRouter>
        <CreatPost/>
      </MemoryRouter>);
    const titleInput = getByLabelText('Title:');
    const postTextInput = getByLabelText('Post:');
    const pictureInput = getByLabelText('Picture:');
  
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(postTextInput, { target: { value: 'Test Post Text' } });
    fireEvent.change(pictureInput, { target: { files: [new File(['test'], 'test.png', { type: 'image/png' })] } });
  
    const submitButton = getByText('Submit Post');
    fireEvent.click(submitButton);
  });