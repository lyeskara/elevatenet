import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { auth, db } from "../../firebase";
import AdminUsers from "./AdminUsers";

jest.mock("../../firebase");

describe("AdminUsers", () => {
  beforeEach(() => {
    auth.currentUser = { uid: "361FbyTxmmZqCT03kGd25kSyDff1" };
    db.collection.mockReturnValue({
      getDocs: jest.fn(() => {
        return {
          docs: [
            {
              id: "1",
              data: jest.fn(() => {
                return {
                  email: "test1@example.com",
                  firstName: "John",
                  lastName: "Doe",
                };
              }),
            },
            {
              id: "2",
              data: jest.fn(() => {
                return {
                  email: "test2@example.com",
                  firstName: "Jane",
                  lastName: "Doe",
                };
              }),
            },
          ],
        };
      }),
      doc: jest.fn(() => {
        return {
          getDoc: jest.fn(() => {
            return {
              id: "1",
              data: jest.fn(() => {
                return {
                  email: "test1@example.com",
                };
              }),
            };
          }),
          setDoc: jest.fn(),
          deleteDoc: jest.fn(),
        };
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Admin Users page when user is an admin", async () => {
    render(<AdminUsers />);
    const title = screen.getByText("Admin Users");
    expect(title).toBeInTheDocument();
    const users = await screen.findAllByRole("heading", { level: 4 });
    expect(users).toHaveLength(2);
  });

  test("displays an error message when user is not an admin", async () => {
    auth.currentUser = null;
    render(<AdminUsers />);
    const errorMessage = await screen.findByText(
      "You do not have permission to view this page."
    );
    expect(errorMessage).toBeInTheDocument();
    const backButton = screen.getByRole("link", { name: "Go to back to main page" });
    fireEvent.click(backButton);
    expect(window.location.pathname).toBe("/");
  });
});
