import { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import formsStyles from "./forms.css?raw";
import {
  Button,
  ConfirmationDialog,
  FileUploadField,
  SelectField,
  TextAreaField,
  TextField,
  ValidationSummary
} from "./index";

describe("shared form and action components", () => {
  it("exposes loading buttons as busy and unavailable", () => {
    render(<Button loading loadingLabel="Saving record">Save</Button>);

    const button = screen.getByRole("button", { name: "Saving record" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });

  it("associates field guidance, required state, and validation errors", () => {
    render(
      <TextField
        id="case-reference"
        label="Case reference"
        description="Use the assigned reference."
        error="Enter a case reference."
        required
      />
    );

    const field = screen.getByRole("textbox", { name: "Case reference" });
    expect(field).toBeRequired();
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAccessibleDescription("Use the assigned reference. Enter a case reference.");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a case reference.");
  });

  it("preserves native select and text-area semantics", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SelectField id="priority" label="Priority">
          <option value="">Select</option>
          <option value="routine">Routine</option>
        </SelectField>
        <TextAreaField id="note" label="Review note" />
      </>
    );

    await user.selectOptions(screen.getByRole("combobox", { name: "Priority" }), "routine");
    await user.type(screen.getByRole("textbox", { name: "Review note" }), "Synthetic note");

    expect(screen.getByRole("combobox", { name: "Priority" })).toHaveValue("routine");
    expect(screen.getByRole("textbox", { name: "Review note" })).toHaveValue("Synthetic note");
  });

  it("reports selected files and rejects files over the client guidance limit", async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn();
    render(
      <FileUploadField
        id="evidence-file"
        label="Supporting file"
        maxSizeBytes={4}
        onFilesSelected={onFilesSelected}
      />
    );

    const input = screen.getByLabelText("Supporting file");
    await user.upload(input, new File(["abc"], "safe.txt", { type: "text/plain" }));
    expect(screen.getByRole("status")).toHaveTextContent("1 file selected");
    expect(onFilesSelected).toHaveBeenLastCalledWith([expect.objectContaining({ name: "safe.txt" })]);

    await user.upload(input, new File(["abcde"], "large.txt", { type: "text/plain" }));
    expect(screen.getByRole("alert")).toHaveTextContent("exceeds the 1 MB client-side limit");
    expect(onFilesSelected).toHaveBeenLastCalledWith([]);
  });

  it("renders permission-denied uploads as unavailable with an explicit reason", () => {
    render(<FileUploadField id="restricted-file" label="Restricted file" status="denied" />);

    expect(screen.getByLabelText("Restricted file")).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("do not have permission");
  });

  it("focuses a linked validation summary when issues appear", async () => {
    const { rerender } = render(<ValidationSummary issues={[]} />);
    rerender(
      <>
        <ValidationSummary issues={[{ fieldId: "required-field", message: "Enter the required value." }]} />
        <input id="required-field" aria-label="Required field" />
      </>
    );

    await waitFor(() => expect(screen.getByRole("alert")).toHaveFocus());
    expect(screen.getByRole("link", { name: "Enter the required value." })).toHaveAttribute(
      "href",
      "#required-field"
    );
  });

  it("contains keyboard focus, supports Escape, and restores focus after confirmation", async () => {
    const user = userEvent.setup();

    function DialogHarness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Launch confirmation</button>
          <ConfirmationDialog
            open={open}
            title="Confirm action?"
            description="Review before continuing."
            confirmLabel="Confirm"
            onConfirm={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </>
      );
    }

    render(<DialogHarness />);
    const launch = screen.getByRole("button", { name: "Launch confirmation" });
    await user.click(launch);

    const cancel = screen.getByRole("button", { name: "Cancel" });
    const confirm = screen.getByRole("button", { name: "Confirm" });
    await waitFor(() => expect(cancel).toHaveFocus());
    await user.tab({ shift: true });
    expect(confirm).toHaveFocus();
    await user.tab();
    expect(cancel).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(launch).toHaveFocus());
  });

  it("uses tokens and includes responsive, coarse-pointer, and forced-color rules", () => {
    expect(formsStyles).not.toMatch(/#[0-9a-f]{3,8}\b|\brgba?\(/i);
    expect(formsStyles).toContain("@media (max-width: 40rem)");
    expect(formsStyles).toContain("@media (pointer: coarse)");
    expect(formsStyles).toContain("@media (forced-colors: active)");
  });
});
