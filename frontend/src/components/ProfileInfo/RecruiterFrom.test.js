import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RecruiterForm from "./RecruiterFrom";

describe("RecruiterForm", () => {
  test("renders form fields", () => {
    render(<RecruiterForm />);
    expect(screen.getByLabelText("First Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
    expect(screen.getByLabelText("City")).toBeInTheDocument();
    expect(screen.getByLabelText("Company")).toBeInTheDocument();
  });

  test("updates form data on input change", () => {
    render(<RecruiterForm />);
    const firstNameInput = screen.getByLabelText("First Name");
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    expect(firstNameInput.value).toBe("John");
  });

  test("submits form data on submit button click", () => {
    const mockCreateUser = jest.fn();
    jest.mock("./RecruiterFrom", () => ({
      __esModule: true,
      default: () => <form onSubmit={mockCreateUser}></form>,
    }));
    render(<RecruiterForm />);
    const submitButton = screen.getByRole("button", { name: "Register" });
    fireEvent.click(submitButton);
    expect(mockCreateUser).toHaveBeenCalled();
  });
});
