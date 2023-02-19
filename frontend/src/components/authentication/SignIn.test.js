/**
 * @jest-environment jsdom
 */


test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
});
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import SignIn from "./SignIn";

test("clicking the sign in button calls the login function with the entered email and password", async () => {
  // Create mock functions and objects
  const mockLogin = jest.fn(() => Promise.resolve());
  const mockNavigate = jest.fn();
  const mockUseUserAuth = jest.fn(() => ({ Login: mockLogin }));
  const mockUseNavigate = jest.fn(() => mockNavigate);
  jest.mock("../../context/UserAuthContext.js", () => ({
    useUserAuth: mockUseUserAuth,
  }));
  jest.mock("react-router-dom", () => ({
    useNavigate: mockUseNavigate,
  }));

  // Render the component
  const { getByText, getByLabelText } = render(<SignIn />);

  // Fill out the form
  const emailInput = getByLabelText("Enter email");
  const passwordInput = getByLabelText("Password");
  const signInButton = getByText("Sign In");
  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });

  // Click the sign in button
  fireEvent.click(signInButton);

  // Check that the login function was called with the correct arguments
  await waitFor(() => expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123"));

  // Check that the user was navigated to the profile page
  expect(mockNavigate).toHaveBeenCalledWith("/Profile");
});