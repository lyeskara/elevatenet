import React from "react";
import { render } from "@testing-library/react";
import SavedJobs from "./SavedJobs";

describe("SavedJobs", () => {
  it("should render without errors", () => {
    render(<SavedJobs />);
  });

  it("should display a list of saved job postings", () => {
    // mock saved job postings
    const saved = [
      {
        id: "1",
        job_title: "Software Engineer",
        company: "Google",
        description: "Develop software for Google's products",
        skills: "JavaScript, Java, C++",
        apply_here: "https://www.google.com/careers",
      },
      {
        id: "2",
        job_title: "Data Analyst",
        company: "Facebook",
        description: "Analyze data to inform business decisions",
        skills: "SQL, Python, Excel",
        apply_here: null,
      },
    ];

    // mock Firebase functions used by SavedJobs
    const getDoc = jest.fn();
    const doc = jest.fn().mockReturnValue({
      get: getDoc.mockResolvedValueOnce({
        data: () => ({
          saved,
        }),
      }),
    });
    const collection = jest.fn().mockReturnValue({
      doc,
    });
    const db = {
      collection,
    };
    const auth = {
      currentUser: {
        uid: "123",
      },
    };
    const storage = {};

    // render SavedJobs with mock Firebase functions and saved job postings
    const { getByText } = render(
      <SavedJobs auth={auth} db={db} storage={storage} />
    );

    // assert that the job postings are displayed on the page
    saved.forEach((posting) => {
      expect(getByText(posting.job_title)).toBeInTheDocument();
      expect(getByText(posting.company)).toBeInTheDocument();
      expect(getByText(posting.description)).toBeInTheDocument();
      expect(getByText(posting.skills)).toBeInTheDocument();
      const applyButton = getByText("Apply Now");
      expect(applyButton).toBeInTheDocument();
      expect(applyButton).toHaveAttribute(
        "href",
        posting.apply_here || `/ApplyToJobs/${posting.id}`
      );
    });
  });
});
