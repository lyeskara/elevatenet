// Import dependencies
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { ChangePassword } from "./ChangePassword";

describe("ChangePassword", () => {
  it("should render the ChangePassword component", () => {
    render(<ChangePassword />);
    const title = screen.getByText("Change Password");
    expect(title).toBeInTheDocument();
  });

  it("should display an error message if the new password and confirm password fields are empty", async () => {
    render(<ChangePassword />);
    const changePasswordBtn = screen.getByText("Change Password");
    fireEvent.click(changePasswordBtn);
    const errorMessage = await screen.findByText("Missing input");
    expect(errorMessage).toBeInTheDocument();
  });

  it("should display an error message if the new password and confirm password fields do not match", async () => {
    render(<ChangePassword />);
    const newPasswordField = screen.getByPlaceholderText("New password");
    const confirmPasswordField = screen.getByPlaceholderText("Confirm password");
    const changePasswordBtn = screen.getByText("Change Password");
    fireEvent.change(newPasswordField, { target: { value: "newpassword" } });
    fireEvent.change(confirmPasswordField, { target: { value: "differentpassword" } });
    fireEvent.click(changePasswordBtn);
    const errorMessage = await screen.findByText("Passwords do not match");
    expect(errorMessage).toBeInTheDocument();
  });

  it("should display a success message if the password is successfully updated", async () => {
    render(<ChangePassword />);
    const newPasswordField = screen.getByPlaceholderText("New password");
    const confirmPasswordField = screen.getByPlaceholderText("Confirm password");
    const changePasswordBtn = screen.getByText("Change Password");
    fireEvent.change(newPasswordField, { target: { value: "newpassword" } });
    fireEvent.change(confirmPasswordField, { target: { value: "newpassword" } });
    fireEvent.click(changePasswordBtn);
    const successMessage = await screen.findByText("Your password has been updated successfully.");
    expect(successMessage).toBeInTheDocument();
  });
});

