import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import ProfileForm from "./ProfileForm";

describe("ProfileForm component", () => {
  test("renders form fields", () => {
    render(<ProfileForm />);
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Bio")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("City")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Education")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Work Experience")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Skills")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Language")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("contact")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  test("allows users to enter information", () => {
    render(<ProfileForm />);
    const firstNameInput = screen.getByPlaceholderText("First Name");
    fireEvent.change(firstNameInput, { target: { value: "John" } });
    expect(firstNameInput.value).toBe("John");

    const lastNameInput = screen.getByPlaceholderText("Last Name");
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    expect(lastNameInput.value).toBe("Doe");

    const bioInput = screen.getByPlaceholderText("Bio");
    fireEvent.change(bioInput, { target: { value: "I am a software engineer" } });
    expect(bioInput.value).toBe("I am a software engineer");

    const cityInput = screen.getByPlaceholderText("City");
    fireEvent.change(cityInput, { target: { value: "San Francisco" } });
    expect(cityInput.value).toBe("San Francisco");

    const educationInput = screen.getByPlaceholderText("Education");
    fireEvent.change(educationInput, { target: { value: "BS Computer Science" } });
    expect(educationInput.value).toBe("BS Computer Science");

    const workExperienceInput = screen.getByPlaceholderText("Work Experience");
    fireEvent.change(workExperienceInput, { target: { value: "5 years of experience" } });
    expect(workExperienceInput.value).toBe("5 years of experience");

    const skillsInput = screen.getByPlaceholderText("Skills");
    fireEvent.change(skillsInput, { target: { value: "JavaScript, React" } });
    expect(skillsInput.value).toBe("JavaScript, React");

    const languagesInput = screen.getByPlaceholderText("Language");
    fireEvent.change(languagesInput, { target: { value: "English, Spanish" } });
    expect(languagesInput.value).toBe("English, Spanish");

    const contactInput = screen.getByPlaceholderText("contact");
    fireEvent.change(contactInput, { target: { value: "john.doe@example.com" } });
    expect(contactInput.value).toBe("john.doe@example.com");
  });
});