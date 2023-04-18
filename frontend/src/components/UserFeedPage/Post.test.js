import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Post from "./Post";

describe("Post", () => {
  it("renders correctly", () => {
    const props = {
      name: "John Doe",
      description: "A post about something",
      message: "Hello, world!",
      photo: "https://example.com/profile.jpg",
      image: "https://example.com/image.jpg",
      post_id: "123",
      id: "456",
    };
    const { container } = render(<Post {...props} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("shows comment box on comment button click", () => {
    const props = {
      name: "John Doe",
      description: "A post about something",
      message: "Hello, world!",
      photo: "https://example.com/profile.jpg",
      image: "https://example.com/image.jpg",
      post_id: "123",
      id: "456",
    };
    render(<Post {...props} />);
    const commentButton = screen.getByAltText("comment");
    fireEvent.click(commentButton);
    const commentBox = screen.getByPlaceholderText("Add a comment...");
    expect(commentBox).toBeInTheDocument();
  });

  it("handles comment submission correctly", () => {
    const props = {
      name: "John Doe",
      description: "A post about something",
      message: "Hello, world!",
      photo: "https://example.com/profile.jpg",
      image: "https://example.com/image.jpg",
      post_id: "123",
      id: "456",
    };
    render(<Post {...props} />);
    const commentButton = screen.getByAltText("comment");
    fireEvent.click(commentButton);
    const commentBox = screen.getByPlaceholderText("Add a comment...");
    fireEvent.change(commentBox, { target: { value: "This is a comment" } });
    fireEvent.submit(commentBox);
    const comments = screen.getAllByTestId("comment");
    expect(comments.length).toBe(1);
    expect(comments[0].textContent).toBe("This is a comment");
  });

  it("handles like and unlike correctly", () => {
    const props = {
      name: "John Doe",
      description: "A post about something",
      message: "Hello, world!",
      photo: "https://example.com/profile.jpg",
      image: "https://example.com/image.jpg",
      post_id: "123",
      id: "456",
    };
    render(<Post {...props} />);
    const likeButton = screen.getByAltText("like");
    fireEvent.click(likeButton);
    const likes = screen.getByTestId("likes");
    expect(likes.textContent).toBe("1");
    fireEvent.click(likeButton);
    expect(likes.textContent).toBe("0");
  });
});