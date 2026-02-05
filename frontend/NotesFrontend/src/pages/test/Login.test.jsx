import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Login from "../Login.jsx";

jest.mock("axios");

// Mock Navbar (not relevant to login behavior)
jest.mock("@/components/Navbar", () => () => <div data-testid="navbar" />);

// Mock PasswordInput to a normal input so we can type easily
jest.mock("@/components/PasswordInput", () => (props) => (
  <input
    placeholder="Password"
    value={props.value}
    onChange={props.onChange}
    type="password"
  />
));

// Mock helpers
jest.mock("@/utils/helper", () => ({
  validateEmail: (email) => email.includes("@"),
  validatePassword: () => true,
  getInitials: (name) => name?.slice(0, 2).toUpperCase(),
}));

// Mock react-router-dom navigate + Link
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
  useNavigate: () => mockNavigate,
}));

describe("Login Page Test", () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("shows error when email is invalid", async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByPlaceholderText("Email"), "invalidEmail");
    await user.type(screen.getByPlaceholderText("Password"), "Pass123");

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/please enter valid email/i)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("shows error when password is missing", async () => {
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByPlaceholderText("Email"), "test@gmail.com");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/please enter a password/i)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("calls login API, stores user in localStorage, and navigates to /dashboard on success", async () => {
    const user = userEvent.setup();

    axios.post.mockResolvedValueOnce({
      data: {
        data: {
          user: { userName: "Ali", email: "test@gmail.com" },
        },
      },
    });

    render(<Login />);

    await user.type(screen.getByPlaceholderText("Email"), "test@gmail.com");
    await user.type(screen.getByPlaceholderText("Password"), "Pass123");

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5005/users/login",
      { email: "test@gmail.com", password: "Pass123" },
      { withCredentials: true }
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });

    const saved = JSON.parse(localStorage.getItem("user"));
    expect(saved.userName).toBe("Ali");
    expect(saved.initials).toBe("AL");
  });

  test("shows backend error message on failure", async () => {
    const user = userEvent.setup();

    axios.post.mockRejectedValueOnce({
      response: { data: { message: "User doesnot exist" } },
    });

    render(<Login />);

    await user.type(screen.getByPlaceholderText("Email"), "test@gmail.com");
    await user.type(screen.getByPlaceholderText("Password"), "Pass123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/user doesnot exist/i)).toBeInTheDocument();
    });
  });
});
