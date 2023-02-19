import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditProfile from "./EditProfile";

describe("EditProfile", () => {
  test("renders Edit button", () => {
    render(<EditProfile />);
    const editButton = screen.getByRole("button", { name: /edit/i });
    expect(editButton).toBeInTheDocument();
  });

  test("opens modal when Edit button is clicked", () => {
    render(<EditProfile />);
    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);
    const modalTitle = screen.getByText(/edit/i);
    expect(modalTitle).toBeInTheDocument();
  });

  // test form inputs and submit functionality
  test("allows user to update profile information", () => {
    // mock user data
    const user = {
      firstName: "John",
      lastName: "Doe",
      city: "New York",
      languages: "English, Spanish",
      contact: "123-456-7890",
      workExperience: "5 years",
      education: "Bachelor's degree",
      skills: "React, JavaScript",
      bio: "Lorem ipsum",
    };
    const setUser = jest.fn();
    render(<EditProfile user={user} setUser={setUser} />);
    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const cityInput = screen.getByLabelText(/location/i);
    const languagesInput = screen.getByLabelText(/languages/i);
    const contactInput = screen.getByLabelText(/contact number/i);
    const workExperienceInput = screen.getByLabelText(/experience/i);
    const educationInput = screen.getByLabelText(/education/i);
    const skillsInput = screen.getByLabelText(/skills/i);
    const bioInput = screen.getByLabelText(/bio/i);
    const submitButton = screen.getByRole("button", { name: /save changes/i });
    // update form inputs
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(cityInput, { target: { value: "Los Angeles" } });
    fireEvent.change(languagesInput, { target: { value: "English, French" } });
    fireEvent.change(contactInput, { target: { value: "987-654-3210" } });
    fireEvent.change(workExperienceInput, { target: { value: "7 years" } });
    fireEvent.change(educationInput, { target: { value: "Master's degree" } });
    fireEvent.change(skillsInput, { target: { value: "React, Node.js" } });
    fireEvent.change(bioInput, { target: { value: "Dolor sit amet" } });
    fireEvent.click(submitButton);
    // check if setUser was called with updated user data
    expect(setUser).toHaveBeenCalledWith({
      firstName: "Jane",
      lastName: "Doe",
      city: "Los Angeles",
      languages: "English, French",
      contact: "987-654-3210",
      workExperience: "7 years",
      education: "Master's degree",
      skills: "React, Node.js",
      bio: "Dolor sit amet",
    });
  });
});