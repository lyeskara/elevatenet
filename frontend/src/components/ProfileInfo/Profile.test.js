/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });

  import React from "react";
  import { render, screen } from "@testing-library/react";
  import Profile from "./Profile";
  
  describe("Profile component", () => {
      test("renders profile information", async () => {
          // Mock user data
          const user = {
              firstName: "John",
              lastName: "Doe",
              city: "New York",
              bio: "Lorem ipsum",
              languages: "English, French",
              email: "john.doe@example.com",
              contact: "555-555-5555",
              education: "New York University",
              skills: "JavaScript, React",
          };
  
          // Mock Firebase and auth.currentUser.uid
          jest.mock("../../firebase", () => ({
              auth: {
                  currentUser: {
                      uid: "user-id",
                  },
              },
              db: {
                  collection: jest.fn().mockReturnThis(),
                  doc: jest.fn().mockReturnThis(),
                  getDoc: jest.fn(() => ({
                      exists: true,
                      data: () => user,
                      id: "user-id",
                  })),
              },
          }));
  
          // Render Profile component
          render(<Profile />);
  
          // Expect profile information to be rendered
          expect(await screen.findByText("John")).toBeInTheDocument();
          expect(screen.getByText("Doe")).toBeInTheDocument();
          expect(screen.getByText("New York")).toBeInTheDocument();
          expect(screen.getByText("Lorem ipsum")).toBeInTheDocument();
          expect(screen.getByText("English, French")).toBeInTheDocument();
          expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
          expect(screen.getByText("555-555-5555")).toBeInTheDocument();
          expect(screen.getByText("New York University")).toBeInTheDocument();
          expect(screen.getByText("JavaScript")).toBeInTheDocument();
          expect(screen.getByText("React")).toBeInTheDocument();
      });
  });