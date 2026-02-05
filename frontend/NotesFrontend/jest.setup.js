import "@testing-library/jest-dom";

// Avoid react-modal warnings in tests
import Modal from "react-modal";
Modal.setAppElement(document.createElement("div"));

// Mock toastify so tests don't actually render toasts
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => null,
}));

// Mock TinyMCE Editor (important)
jest.mock("@tinymce/tinymce-react", () => ({
  Editor: ({ value, onEditorChange }) => (
    <textarea
      data-testid="tinymce"
      value={value}
      onChange={(e) => onEditorChange(e.target.value)}
    />
  ),
}));
