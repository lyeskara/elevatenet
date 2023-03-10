/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateEvent from "./CreateEvent";

describe('CreateEvent component', () => {
    test('submit button works', () => {
      // mock the functions needed for the component
      const handleSubmitMock = jest.fn();
     
  
      // render the component
      render(<CreateEvent handleSubmit={handleSubmitMock} />);
  
    
      // verify that the handleSubmit function was called
      expect(handleSubmitMock).toHaveBeenCalled();
    });
  });