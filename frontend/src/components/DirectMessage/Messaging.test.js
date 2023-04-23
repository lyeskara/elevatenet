import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Message from "./Message";

describe("Message component", () => {
  test("renders message input field", () => {
    render(<Message />);
    const inputElement = screen.getByPlaceholderText("Type a message...");
    expect(inputElement).toBeInTheDocument();
  });

  test("updates message state when input changes", () => {
    render(<Message />);
    const inputElement = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(inputElement, { target: { value: "test message" } });
    expect(inputElement.value).toBe("test message");
  });

  test("renders send button", () => {
    render(<Message />);
    const buttonElement = screen.getByText("Send");
    expect(buttonElement).toBeInTheDocument();
  });

  test("sends message when send button is clicked", () => {
    render(<Message />);
    const inputElement = screen.getByPlaceholderText("Type a message...");
    fireEvent.change(inputElement, { target: { value: "test message" } });
    const buttonElement = screen.getByText("Send");
    fireEvent.click(buttonElement);
    expect(inputElement.value).toBe("");
  });

  test("renders file input field", () => {
    render(<Message />);
    const inputElement = screen.getByLabelText("Attach file");
    expect(inputElement).toBeInTheDocument();
  });

  test("updates file state when file input changes", () => {
    render(<Message />);
    const inputElement = screen.getByLabelText("Attach file");
    const file = new File(["file content"], "test.png", { type: "image/png" });
    fireEvent.change(inputElement, { target: { files: [file] } });
    expect(inputElement.files[0]).toStrictEqual(file);
  });

  test("displays file name when file is selected", () => {
    render(<Message />);
    const inputElement = screen.getByLabelText("Attach file");
    const file = new File(["file content"], "test.png", { type: "image/png" });
    fireEvent.change(inputElement, { target: { files: [file] } });
    const fileNameElement = screen.getByText("test.png");
    expect(fileNameElement).toBeInTheDocument();
  });
});
