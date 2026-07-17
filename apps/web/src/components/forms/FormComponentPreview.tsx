import { useState } from "react";
import { Button } from "./Button";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { FileUploadField } from "./FileUploadField";
import { SelectField, TextAreaField } from "./Fields";

export function FormComponentPreview() {
  const [priority, setPriority] = useState("");
  const [note, setNote] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section className="panel component-preview" id="form-components" aria-labelledby="form-components-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Shared components</p>
          <h2 id="form-components-title">Forms and actions</h2>
        </div>
        <span className="panel-index">S2 / 05</span>
      </div>

      <div className="component-preview__grid">
        <SelectField
          id="preview-priority"
          label="Review priority"
          description="Choose a local preview value; no API request is made."
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="">Select a priority</option>
          <option value="routine">Routine</option>
          <option value="time-sensitive">Time-sensitive</option>
        </SelectField>

        <TextAreaField
          id="preview-note"
          label="Review note"
          description="Use synthetic, non-sensitive text in this foundation preview."
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          placeholder="Add a short local note"
        />

        <FileUploadField
          id="preview-file"
          label="Supporting file"
          description="Client checks are guidance only. The server must revalidate type, size, authorization, name, and content."
          accept="image/jpeg,image/png,application/pdf"
          maxSizeBytes={5 * 1024 * 1024}
        />
      </div>

      <div className="form-actions">
        <Button variant="primary" onClick={() => setConfirmationOpen(true)}>Open confirmation</Button>
        <Button variant="secondary" onClick={() => { setPriority(""); setNote(""); setConfirmed(false); }}>
          Reset preview
        </Button>
      </div>

      {confirmed && <p className="component-preview__success" role="status">Local confirmation completed. No data was sent.</p>}

      <ConfirmationDialog
        open={confirmationOpen}
        title="Confirm this local preview?"
        description="This demonstrates the confirmation pattern only. It does not save, upload, authorize, or change project data."
        confirmLabel="Confirm preview"
        onCancel={() => setConfirmationOpen(false)}
        onConfirm={() => { setConfirmationOpen(false); setConfirmed(true); }}
      />
    </section>
  );
}
