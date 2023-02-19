/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });
  
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatPost from "./CreatPost";

// mock Firebase services
jest.mock("../../firebase", () => ({
  db: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
    getDoc: jest.fn(() => Promise.resolve({ data: () => ({}) })),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
  },
  auth: {
    currentUser: { uid: "test-user-id" },
  },
  storage: {
    ref: jest.fn(() => ({
      getDownloadURL: jest.fn(() => Promise.resolve("https://test.url")),
      put: jest.fn(() => Promise.resolve()),
    })),
  },
}));

describe("CreatPost component", () => {
  test("should render the form and create a new post", async () => {
    render(<CreatPost />);

    // fill out the form
    fireEvent.change(screen.getByPlaceholderText("Title..."), {
      target: { value: "Test Title" },
    });
    fireEvent.change(screen.getByPlaceholderText("Post..."), {
      target: { value: "Test Post" },
    });
    const file = new File(["test image"], "test.jpg", { type: "image/jpeg" });
    fireEvent.change(screen.getByTestId("file-input"), { target: { files: [file] } });

    // submit the form
    fireEvent.click(screen.getByText("Submit Post"));

    // wait for the post to be created
    await waitFor(() => expect(screen.getByText("Test Title")).toBeInTheDocument());
    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByTestId("post-picture")).toHaveAttribute(
      "src",
      "https://test.url"
    );
  });

  test("should redirect to login page if user is not authenticated", () => {
    // mock the currentUser to be null
    jest.mock("../../firebase", () => ({
      auth: {
        currentUser: null,
      },
    }));

    render(<CreatPost />);

    expect(screen.getByText("Create A Post")).toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Title...")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Post...")).not.toBeInTheDocument();
    expect(screen.queryByTestId("file-input")).not.toBeInTheDocument();
    expect(screen.queryByText("Submit Post")).not.toBeInTheDocument();
    expect(screen.queryByText("test-user-id")).not.toBeInTheDocument();
    expect(screen.queryByText("test image")).not.toBeInTheDocument();
  });
});