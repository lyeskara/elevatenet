/**
 * @jest-environment jsdom
 */

test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
  });
  
import React from "react";
import { render, screen } from "@testing-library/react";
import Feed from "./Feed";
import { getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";

jest.mock("firebase/firestore", () => {
  return {
    getDoc: jest.fn(),
    doc: jest.fn(),
    collection: jest.fn(),
  };
});

jest.mock("../../firebase", () => {
  return {
    db: jest.fn(),
    auth: {
      currentUser: { uid: "test-user-id" },
    },
  };
});

describe("Feed", () => {
  it("should render post data", async () => {
    const data = {
      post1: {
        title: "Test Title 1",
        postText: "Test Post 1",
        PicUrl: "http://test.com/test1.png",
      },
      post2: {
        title: "Test Title 2",
        postText: "Test Post 2",
        PicUrl: null,
      },
    };
    const mockGetDoc = jest.fn();
    mockGetDoc.mockReturnValue({
      data: jest.fn().mockReturnValue(data),
    });
    getDoc.mockReturnValue(mockGetDoc());

    render(<Feed />);

    // Check if the posts are displayed
    const postTitles = screen.getAllByRole("heading", { level: 2 });
    expect(postTitles.length).toBe(2);
    expect(postTitles[0]).toHaveTextContent(data.post1.title);
    expect(postTitles[1]).toHaveTextContent(data.post2.title);

    const postTexts = screen.getAllByRole("paragraph");
    expect(postTexts.length).toBe(2);
    expect(postTexts[0]).toHaveTextContent(data.post1.postText);
    expect(postTexts[1]).toHaveTextContent(data.post2.postText);

    const postImages = screen.getAllByRole("img");
    expect(postImages.length).toBe(1);
    expect(postImages[0]).toHaveAttribute("src", data.post1.PicUrl);
  });
});