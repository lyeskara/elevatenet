/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Messaging from './Messaging';

// mock Firebase services
jest.mock("../../firebase", () => ({
    db: {
      collection: jest.fn().mockReturnThis(),
      doc: jest.fn().mockReturnThis(),
      getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
      getDoc: jest.fn(() => Promise.resolve({ data: () => ({}) })),
      setDoc: jest.fn(),
      updateDoc: jest.fn(),
    },
    auth: {
      currentUser: { uid: "test-user-id" },
    },
    storage: {
      ref: jest.fn(() => ({
        getDownloadURL: jest.fn(() => Promise.resolve("https://test.url")),
        put: jest.fn(() => Promise.resolve()),
      })),
    },
  }));
  
describe('Messaging component', () => {
    test('renders list of people', () => {
      render(<Messaging />);
      const peopleList = screen.getByText('Chat List');
      expect(peopleList).toBeInTheDocument();
    });
  
    test('renders message input and send button', () => {
      render(<Messaging />);
      const inputElement = screen.getByPlaceholderText('Write a message...');
      const sendButton = screen.getByRole('button', { name: 'Send' });
      expect(inputElement).toBeInTheDocument();
      expect(sendButton).toBeInTheDocument();
    });
  
    test('updates message input value when typing', () => {
      render(<Messaging />);
      const inputElement = screen.getByPlaceholderText('Write a message...');
      fireEvent.change(inputElement, { target: { value: 'Hello' } });
      expect(inputElement.value).toBe('Hello');
    });
  
    test('renders messages when user selects a recipient', () => {
      render(<Messaging />);
      const person2 = screen.getByText('Person 2');
      fireEvent.click(person2);
      const message = screen.getByText('This is a test message');
      expect(message).toBeInTheDocument();
    });
  
    test('adds message to the list when user clicks send', () => {
      render(<Messaging />);
      const inputElement = screen.getByPlaceholderText('Write a message...');
      const sendButton = screen.getByRole('button', { name: 'Send' });
      fireEvent.change(inputElement, { target: { value: 'Hello' } });
      fireEvent.click(sendButton);
      const message = screen.getByText('Hello');
      expect(message).toBeInTheDocument();
    });
  });

// const messaging = require('./Messaging');

// test('send message to user', () => {
//   const message = 'Hello World!';
//   const userId = 'user123';
  
//   const result = messaging.sendMessage(userId, message);
  
//   expect(result).toEqual(`Message "${message}" sent to user "${userId}".`);
// });

// test('get messages for user', () => {
//   const userId = 'user123';
  
//   const result = messaging.getMessages(userId);
  
//   expect(result).toEqual([]);
// });

// test('sendMessage sends a message', () => {
//     // Arrange
//     const message = 'Hello world';
//     const recipient = 'user@example.com';
  
//     // Act
//     const result = sendMessage(message, recipient);
  
//     // Assert
//     expect(result).toEqual(true);
//   });