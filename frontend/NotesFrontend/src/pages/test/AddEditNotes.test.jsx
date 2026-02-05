import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import AddEditNotes from "../AddEditNotes.jsx";
import { toast } from "react-toastify";

jest.mock("axios");

describe("AddEditNotes feature test", () => {
  test("shows validation error if title is empty", async () => {
    const user = userEvent.setup();

    render(
      <AddEditNotes
        type="add"
        noteData={null}
        onClose={jest.fn()}
        fetchNotes={jest.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByText(/please enter the title/i)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("shows validation error if content is empty", async () => {
    const user = userEvent.setup();

    render(
      <AddEditNotes
        type="add"
        noteData={null}
        onClose={jest.fn()}
        fetchNotes={jest.fn()}
      />
    );

    await user.type(screen.getByPlaceholderText(/title here/i), "My title");
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByText(/please enter the content/i)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  test("calls axios.post on ADD and then fetchNotes + onClose + toast", async () => {
    const user = userEvent.setup();
    axios.post.mockResolvedValueOnce({ data: { success: true } });

    const fetchNotes = jest.fn();
    const onClose = jest.fn();

    render(
      <AddEditNotes
        type="add"
        noteData={null}
        onClose={onClose}
        fetchNotes={fetchNotes}
      />
    );

    await user.type(screen.getByPlaceholderText(/title here/i), "My title");
    await user.type(screen.getByTestId("tinymce"), "My content");

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5005/notes/add",
      { title: "My title", content: "My content" },
      { withCredentials: true }
    );

    // allow promises to resolve
    await Promise.resolve();

    expect(fetchNotes).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalled();
  });

  test("calls axios.put on UPDATE (edit mode)", async () => {
    const user = userEvent.setup();
    axios.put.mockResolvedValueOnce({ data: { success: true } });

    const fetchNotes = jest.fn();
    const onClose = jest.fn();

    render(
      <AddEditNotes
        type="edit"
        noteData={{ _id: "n1", title: "Old", content: "OldC" }}
        onClose={onClose}
        fetchNotes={fetchNotes}
      />
    );

    await user.clear(screen.getByPlaceholderText(/title here/i));
    await user.type(screen.getByPlaceholderText(/title here/i), "New title");

    await user.clear(screen.getByTestId("tinymce"));
    await user.type(screen.getByTestId("tinymce"), "New content");

    await user.click(screen.getByRole("button", { name: /update/i }));

    expect(axios.put).toHaveBeenCalledWith(
      "http://localhost:5005/notes/edit/n1",
      { title: "New title", content: "New content" },
      { withCredentials: true }
    );

    await Promise.resolve();

    expect(fetchNotes).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalled();
  });
});
