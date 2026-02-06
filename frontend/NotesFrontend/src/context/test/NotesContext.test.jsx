import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { NotesProvider, useNotes } from "../NotesContext.jsx";

jest.mock("axios");

function Consumer() {
  const { filteredNotes, fetchNotes, setSearchQuery } = useNotes();

  return (
    <div>
      <button onClick={fetchNotes}>load</button>
      <button onClick={() => setSearchQuery("hello")}>search</button>
      <div data-testid="count">{filteredNotes.length}</div>
      <ul>
        {filteredNotes.map((n) => (
          <li key={n._id}>{n.title}</li>
        ))}
      </ul>
    </div>
  );
}

describe("NotesContext and search filter", () => {
  test("fetchNotes loads notes and filteredNotes filters by title/content", async () => {
    const user = userEvent.setup();

    axios.get.mockResolvedValueOnce({
      data: {
        data: [
          { _id: "1", title: "Hello", content: "World" },
          { _id: "2", title: "Other", content: "Text" },
        ],
      },
    });

    render(
      <NotesProvider>
        <Consumer />
      </NotesProvider>
    );

    // load notes
    await user.click(screen.getByText("load"));

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("2");
    });

    // search filters
    await user.click(screen.getByText("search"));

    await waitFor(() => {
      expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
