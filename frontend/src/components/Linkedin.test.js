import React from "react";
import { render, screen } from "@testing-library/react";
import Linkedin from "./Linkedin";

describe("Linkedin", () => {
  test("renders the component with correct text", () => {
    render(<Linkedin />);
    expect(screen.getByText(/bring your career to new/i)).toBeInTheDocument();
    expect(screen.getByText(/where interests/i)).toBeInTheDocument();
    expect(screen.getByText(/become friendships/i)).toBeInTheDocument();
    expect(screen.getByText(/whatever your interest/i)).toBeInTheDocument();
  });
});
