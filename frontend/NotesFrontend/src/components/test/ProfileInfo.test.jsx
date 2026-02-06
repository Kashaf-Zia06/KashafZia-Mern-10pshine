import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileInfo from "../ProfileInfo.jsx";

describe("ProfileInfo Card display test", () => {
  const userData = {
    userName: "Ali",
    email: "ali@test.com",
    initials: "AL",
  };

  beforeEach(() => {
    localStorage.setItem("user", JSON.stringify(userData));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders initials from localStorage", () => {
    render(<ProfileInfo onLogout={jest.fn()} />);

    // The initials should be visible inside the avatar circle
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  test("calls onLogout when Logout button is clicked", async () => {
    const user = userEvent.setup();
    const onLogout = jest.fn();

    render(<ProfileInfo onLogout={onLogout} />);

    await user.click(screen.getByRole("button", { name: /logout/i }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  test("opens profile card modal on avatar click and shows user details", async () => {
    const user = userEvent.setup();
    render(<ProfileInfo onLogout={jest.fn()} />);

    // Click avatar to open modal
    await user.click(screen.getByText("AL"));

    // Modal content should appear (rendered via portal)
    expect(screen.getByText(/username:/i)).toBeInTheDocument();
    expect(screen.getByText("Ali")).toBeInTheDocument();

    expect(screen.getByText(/email:/i)).toBeInTheDocument();
    expect(screen.getByText("ali@test.com")).toBeInTheDocument();
  });

  test("closes modal when X button is clicked", async () => {
    const user = userEvent.setup();
    render(<ProfileInfo onLogout={jest.fn()} />);

    // open
    await user.click(screen.getByText("AL"));
    expect(screen.getByText(/username:/i)).toBeInTheDocument();

    // close
    await user.click(screen.getByRole("button", { name: "✕" }));

    // after closing, modal content should disappear
    expect(screen.queryByText(/username:/i)).not.toBeInTheDocument();
  });
});
