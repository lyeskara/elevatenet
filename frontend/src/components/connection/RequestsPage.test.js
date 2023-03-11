import React from "react";
import { render, screen } from "@testing-library/react";
import RequestsPage from "./RequestsPage";

describe("RequestsPage", () => {
  it("renders the title of the page", () => {
    render(<RequestsPage />);
    const pageTitle = screen.getByText(/Manage Invitations/i);
    expect(pageTitle).toBeInTheDocument();
  });
  
  it("renders a card for each request", () => {
    const mockRequests = [
      { id: "1", firstName: "John", lastName: "Doe" },
      { id: "2", firstName: "Jane", lastName: "Doe" },
    ];
    jest.spyOn(React, "useState").mockImplementation(() => [
      mockRequests,
      jest.fn(),
    ]);
    render(<RequestsPage />);
    const requestCards = screen.getAllByTestId("request-card");
    expect(requestCards).toHaveLength(mockRequests.length);
  });
  
  // Add more tests as needed
});