import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Signup from "../Signup.jsx";

jest.mock("axios");

jest.mock("@/components/Navbar", () => () => <div data-testid="navbar" />);

jest.mock("@/components/PasswordInput", () => (props) => (
  <input
    placeholder="Password"
    value={props.value}
    onChange={props.onChange}
    type="password"
  />
));

jest.mock("@/utils/helper", () => ({
  validateEmail: (email) => email.includes("@"),
  validatePassword: (pwd) => pwd.length >= 6,
  getInitials: () => "XX",
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  Link: ({ to, children }) => <a href={to}>{children}</a>,
  useNavigate: () => mockNavigate,
}));

describe("Signup Page Test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows error when username is missing", async () => {
    const user = userEvent.setup();
    render(<Signup />);

    await user.type(screen.getByPlaceholderText("Email"), "test@gmail.com");
    await user.type(screen.getByPlaceholderText("Password"), "Pass123");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText(/please enter name/i)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("shows error when email is invalid", async () => {
    const user = userEvent.setup();
    render(<Signup />);

    await user.type(screen.getByPlaceholderText("UserName"), "Ali");
    await user.type(screen.getByPlaceholderText("Email"), "invalid");
    await user.type(screen.getByPlaceholderText("Password"), "Pass123");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText(/please enter valid email/i)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("shows error when password is weak", async () => {
    const user = userEvent.setup();
    render(<Signup />);

    await user.type(screen.getByPlaceholderText("UserName"), "Ali");
    await user.type(screen.getByPlaceholderText("Email"), "test@gmail.com");
    await user.type(screen.getByPlaceholderText("Password"), "123"); // too short

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      screen.getByText(/password must be at least 6/i)
    ).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("calls signup API and navigates to /login on success", async () => {
    const user = userEvent.setup();
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    render(<Signup />);

    await user.type(screen.getByPlaceholderText("UserName"), "Ali");
    await user.type(screen.getByPlaceholderText("Email"), "test@gmail.com");
    await user.type(screen.getByPlaceholderText("Password"), "Pass123");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5005/users/signup",
      { userName: "Ali", email: "test@gmail.com", password: "Pass123" },
      { withCredentials: true }
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("shows backend error message on failure", async () => {
    const user = userEvent.setup();
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "User already exists" } },
    });

    render(<Signup />);

    await user.type(screen.getByPlaceholderText("UserName"), "Ali");
    await user.type(screen.getByPlaceholderText("Email"), "test@gmail.com");
    await user.type(screen.getByPlaceholderText("Password"), "Pass123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
    });
  });
});
