import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Security from "./Security";

describe("Security component", () => {
  test("renders the setting menu", () => {
    const { getByText } = render(<Security />);

    expect(getByText("Settings")).toBeInTheDocument();
    expect(getByText("Account Preferences")).toBeInTheDocument();
    expect(getByText("Security")).toBeInTheDocument();
    expect(getByText("Notifications")).toBeInTheDocument();
  });

  test("redirects to Account Preferences page when clicked", () => {
    const { getByText } = render(<Security />);
    const accountLink = getByText("Account Preferences");

    fireEvent.click(accountLink);

    expect(window.location.href).toBe("/ProfileInfoSettings");
  });

  test("redirects to Security page when clicked", () => {
    const { getByText } = render(<Security />);
    const securityLink = getByText("Security");

    fireEvent.click(securityLink);

    expect(window.location.href).toBe("/Security");
  });

  test("redirects to Notification Settings page when clicked", () => {
    const { getByText } = render(<Security />);
    const notificationsLink = getByText("Notifications");

    fireEvent.click(notificationsLink);

    expect(window.location.href).toBe("/NotificationSettings");
  });

  test("renders the change password option", () => {
    const { getByText, getByAltText } = render(<Security />);
    const changePasswordLink = getByText("Change Password");
    const arrowImage = getByAltText("node");

    expect(changePasswordLink).toBeInTheDocument();
    expect(arrowImage).toBeInTheDocument();
  });

  test("redirects to Change Password page when arrow is clicked", () => {
    const { getByAltText } = render(<Security />);
    const arrowImage = getByAltText("node");

    fireEvent.click(arrowImage);

    expect(window.location.href).toBe("/ChangePassword");
  });
});
