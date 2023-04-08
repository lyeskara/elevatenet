import { render, screen, fireEvent } from "@testing-library/react";
import Message from "./Messaging";

describe("Message component", () => {
  test("should call handleSubmit function when the form is submitted", () => {
    const handleSubmit = jest.fn();
    render(<Message onSubmit={handleSubmit} />);
    const form = screen.getByRole("form");
    fireEvent.submit(form);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
