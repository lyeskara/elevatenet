import { render, screen, fireEvent } from "@testing-library/react";
import CompanySearch from "./CompanySearch";

// mock the firebase modules used in the component
jest.mock("../../firebase", () => {
  const firebase = jest.requireActual("firebase/app");
  return {
    auth: {
      currentUser: {
        uid: "testuser",
      },
    },
    db: {
      collection: () => ({
        doc: () => ({
          get: jest.fn(() => Promise.resolve({ data: () => ({ requests: [] }) })),
          update: jest.fn(),
        }),
        where: jest.fn(() => ({
          get: jest.fn(() =>
            Promise.resolve({ docs: [{ id: "testdoc", data: () => ({}) }] })
          ),
        })),
        get: jest.fn(() => Promise.resolve({ docs: [] })),
        add: jest.fn(),
      }),
    },
    getStorage: jest.fn(),
    ref: jest.fn(),
    getDownloadURL: jest.fn(),
  };
});

describe("CompanySearch component", () => {
  const users = [
    {
      id: "testuser1",
      firstName: "John",
      lastName: "Doe",
      bio: "Lorem ipsum dolor sit amet",
      workExperience: "Acme Inc.",
    },
    {
      id: "testuser2",
      firstName: "Jane",
      lastName: "Doe",
      bio: "Lorem ipsum dolor sit amet",
      workExperience: "XYZ Corp.",
    },
  ];

  test("renders search results and handles follow", () => {
    // set up test props and render component
    const location = {
      search: "?search=test&result=" + encodeURIComponent(JSON.stringify(users)),
    };
    render(<CompanySearch location={location} />);

    // check that search results are rendered
    const searchResults = screen.getAllByRole("listitem");
    expect(searchResults).toHaveLength(users.length);

    // check that search result info is rendered
    users.forEach((user, i) => {
      const name = screen.getByText(user.firstName + " " + user.lastName);
      const bio = screen.getByText(user.bio);
      const workExperience = screen.getByText("Work experience at " + user.workExperience);
      const connectButton = screen.getByRole("button", { name: "Connect" });
      expect(name).toBeInTheDocument();
      expect(bio).toBeInTheDocument();
      expect(workExperience).toBeInTheDocument();
      expect(connectButton).toBeInTheDocument();

      // simulate click on connect button and check that handlefollow function is called
      fireEvent.click(connectButton);
      expect(db.collection().doc().get).toHaveBeenCalled();
      expect(db.collection().doc().update).toHaveBeenCalled();
    });
  });
});
