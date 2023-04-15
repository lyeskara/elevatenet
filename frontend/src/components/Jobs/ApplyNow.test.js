import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ApplyNow from "./ApplyNow";

describe("ApplyNow component", () => {
  test("renders the form", () => {
    render(<ApplyNow />);
    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
  });

  test("renders the Resume input", () => {
    render(<ApplyNow />);
    const input = screen.getByLabelText("Resume");
    expect(input).toBeInTheDocument();
  });

  test("renders the Cover Letter input", () => {
    render(<ApplyNow />);
    const input = screen.getByLabelText("Cover Letter");
    expect(input).toBeInTheDocument();
  });

  test("renders the submit button", () => {
    render(<ApplyNow />);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();
  });

  test("uploads the Resume file when selected", () => {
    // TODO: Mock the Firebase APIs
    render(<ApplyNow />);
    const file = new File(["dummy content"], "resume.txt", { type: "text/plain" });
    const input = screen.getByLabelText("Resume");
    fireEvent.change(input, { target: { files: [file] } });
    expect(input.files[0]).toStrictEqual(file);
  });

  test("uploads the Cover Letter file when selected", () => {
    // TODO: Mock the Firebase APIs
    render(<ApplyNow />);
    const file = new File(["dummy content"], "cover-letter.txt", { type: "text/plain" });
    const input = screen.getByLabelText("Cover Letter");
    fireEvent.change(input, { target: { files: [file] } });
    expect(input.files[0]).toStrictEqual(file);
  });

  test("sends the application when submitted", async () => {
    // TODO: Mock the Firebase APIs
    render(<ApplyNow />);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);
    const message = await screen.findByText(/you have already made a job application/i);
    expect(message).toBeInTheDocument();
  });
});
