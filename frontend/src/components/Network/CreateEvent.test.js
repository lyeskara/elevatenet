import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateEvent from "./CreateEvent";

describe("CreateEvent", () => {
  it("renders the input fields and submit button", () => {
    render(<CreateEvent />);
    const eventTitleInput = screen.getByLabelText("Event Title");
    const eventTypeRadio = screen.getByLabelText("Online");
    const descriptionInput = screen.getByLabelText("Description");
    const startDateInput = screen.getByLabelText("Start Date");
    const startTimeInput = screen.getByLabelText("Start Time");
    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(eventTitleInput).toBeInTheDocument();
    expect(eventTypeRadio).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(startDateInput).toBeInTheDocument();
    expect(startTimeInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  it("updates state when input fields are changed", () => {
    render(<CreateEvent />);
    const eventTitleInput = screen.getByLabelText("Event Title");
    const eventTypeRadio = screen.getByLabelText("Online");
    const descriptionInput = screen.getByLabelText("Description");
    const startDateInput = screen.getByLabelText("Start Date");
    const startTimeInput = screen.getByLabelText("Start Time");
    fireEvent.change(eventTitleInput, { target: { value: "Test Event" } });
    fireEvent.click(eventTypeRadio);
    fireEvent.change(descriptionInput, { target: { value: "Test description" } });
    fireEvent.change(startDateInput, { target: { value: "2023-03-12" } });
    fireEvent.change(startTimeInput, { target: { value: "10:00" } });
    expect(eventTitleInput).toHaveValue("Test Event");
    expect(eventTypeRadio).toBeChecked();
    expect(descriptionInput).toHaveValue("Test description");
    expect(startDateInput).toHaveValue("2023-03-12");
    expect(startTimeInput).toHaveValue("10:00");
  });

  it("submits the form with correct data when submit button is clicked", async () => {
    const handleSubmit = jest.fn();
    render(<CreateEvent onSubmit={handleSubmit} />);
    const eventTitleInput = screen.getByLabelText("Event Title");
    const eventTypeRadio = screen.getByLabelText("Online");
    const descriptionInput = screen.getByLabelText("Description");
    const startDateInput = screen.getByLabelText("Start Date");
    const startTimeInput = screen.getByLabelText("Start Time");
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.change(eventTitleInput, { target: { value: "Test Event" } });
    fireEvent.click(eventTypeRadio);
    fireEvent.change(descriptionInput, { target: { value: "Test description" } });
    fireEvent.change(startDateInput, { target: { value: "2023-03-12" } });
    fireEvent.change(startTimeInput, { target: { value: "10:00" } });
    fireEvent.click(submitButton);
    expect(handleSubmit).toHaveBeenCalledWith({
      event_title: "Test Event",
      event_type: "Online",
      description: "Test description",
      start_date: "2023-03-12",
      start_time: "10:00",
      duration: "",
    });
  });
});