import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Post from './Post';

describe('Post', () => {
  it('renders post information', () => {
    render(
      <Post
        name="John Doe"
        description="Software Engineer"
        message="This is a test post."
        photo="https://example.com/profile.jpg"
        image="https://example.com/post.jpg"
        post_id="abc123"
        id="user123"
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('This is a test post.')).toBeInTheDocument();
    expect(screen.getByAltText('post image')).toBeInTheDocument();
    expect(screen.getByAltText('profile picture')).toBeInTheDocument();
  });

  it('shows comment box when comment button is clicked', () => {
    render(
      <Post
        name="John Doe"
        description="Software Engineer"
        message="This is a test post."
        photo="https://example.com/profile.jpg"
        image="https://example.com/post.jpg"
        post_id="abc123"
        id="user123"
      />
    );

    const commentButton = screen.getByTestId('comment-button');
    fireEvent.click(commentButton);
    expect(screen.getByTestId('comment-form')).toBeInTheDocument();
  });

  it('submits comment when comment form is submitted', () => {
    render(
      <Post
        name="John Doe"
        description="Software Engineer"
        message="This is a test post."
        photo="https://example.com/profile.jpg"
        image="https://example.com/post.jpg"
        post_id="abc123"
        id="user123"
      />
    );

    const commentButton = screen.getByTestId('comment-button');
    fireEvent.click(commentButton);
    const commentInput = screen.getByTestId('comment-input');
    fireEvent.change(commentInput, { target: { value: 'This is a test comment.' } });
    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);
    expect(screen.getByText('This is a test comment.')).toBeInTheDocument();
  });

  it('shows number of likes and can be liked and unliked', () => {
    render(
      <Post
        name="John Doe"
        description="Software Engineer"
        message="This is a test post."
        photo="https://example.com/profile.jpg"
        image="https://example.com/post.jpg"
        post_id="abc123"
        id="user123"
      />
    );

    expect(screen.getByText('0 likes')).toBeInTheDocument();

    const likeButton = screen.getByTestId('like-button');
    fireEvent.click(likeButton);
    expect(screen.getByText('1 likes')).toBeInTheDocument();

    const unlikeButton = screen.getByTestId('unlike-button');
    fireEvent.click(unlikeButton);
    expect(screen.getByText('0 likes')).toBeInTheDocument();
  });
});
