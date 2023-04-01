import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import GroupPage from "./GroupPage";
import { db, auth } from "../../firebase";

jest.mock("../../firebase");

const mockGroup = {
  id: "1",
  group_name: "Test Group",
  memberUIDs: ["user1", "user2"],
  industry: "Test Industry",
  location: "Test Location",
  description: "Test Description",
  group_img_url: "test_url",
};

describe("GroupPage", () => {
  beforeAll(() => {
    auth.currentUser = { uid: "user1" };
    db.__setMockData({
      groups: {
        [mockGroup.id]: mockGroup,
      },
      users_information: {
        user2: {
          firstName: "John",
          lastName: "Doe",
        },
      },
    });
  });

  test("displays group information and member names", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={[`/groups/${mockGroup.id}`]}>
          <Route path="/groups/:id">
            <GroupPage />
          </Route>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText(mockGroup.group_name)).toBeInTheDocument();
      expect(screen.getByText(`${mockGroup.memberUIDs.length} members`)).toBeInTheDocument();
      expect(screen.getByText(mockGroup.industry)).toBeInTheDocument();
      expect(screen.getByText(mockGroup.location)).toBeInTheDocument();
      expect(screen.getByText(mockGroup.description)).toBeInTheDocument();
      expect(screen.getByAltText("group image")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  test("leaves the group when 'Leave Group' button is clicked", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={[`/groups/${mockGroup.id}`]}>
          <Route path="/groups/:id">
            <GroupPage />
          </Route>
        </MemoryRouter>
      );
    });

    const leaveButton = screen.getByText("Leave Group");

    await act(async () => {
      leaveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(db.doc.mock.calls.length).toBe(1);
    expect(db.doc.mock.calls[0][1]).toEqual({
      ...mockGroup,
      memberUIDs: ["user2"],
    });
  });
});
