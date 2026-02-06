import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import ResetPassword from "../ResetPassword.jsx";
import { toast } from "react-toastify";

jest.mock("axios");

jest.mock("@/components/PasswordInput", () => (props) => (
  <input
    placeholder="Password"
    value={props.value}
    onChange={props.onChange}
    type="password"
  />
));

jest.mock("@/utils/helper", () => ({
  validatePassword: (pwd) => pwd.length >= 6,
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ token: "abc123" }),
}));

describe("ResetPassword Page Test", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("shows error if password is empty", async () => {
    const user = userEvent.setup();
    render(<ResetPassword />);

    await user.click(screen.getByRole("button", { name: /reset password/i }));
    expect(screen.getByText(/please enter password/i)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("shows error if password is weak", async () => {
    const user = userEvent.setup();
    render(<ResetPassword />);

    await user.type(screen.getByPlaceholderText("Password"), "123");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(
      screen.getByText(/password must be at least 6/i)
    ).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("calls reset API, shows toast, navigates to /login on success", async () => {
    const user = userEvent.setup();
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    render(<ResetPassword />);

    await user.type(screen.getByPlaceholderText("Password"), "Pass123");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5005/users/reset-password/abc123",
      { password: "Pass123" }
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("shows backend error on failure", async () => {
    const user = userEvent.setup();
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Token invalid or expired" } },
    });

    render(<ResetPassword />);

    await user.type(screen.getByPlaceholderText("Password"), "Pass123");
    await user.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/token invalid or expired/i)).toBeInTheDocument();
    });
  });
});
