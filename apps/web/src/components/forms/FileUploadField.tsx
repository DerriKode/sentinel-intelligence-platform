import { useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import { FieldFrame } from "./FieldFrame";

export type UploadStatus = "idle" | "uploading" | "success" | "error" | "denied";

export interface FileUploadFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "required" | "onChange"> {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  maxSizeBytes?: number;
  status?: UploadStatus;
  statusMessage?: string;
  onFilesSelected?: (files: File[]) => void;
}

const defaultStatusMessages: Record<Exclude<UploadStatus, "idle">, string> = {
  uploading: "Uploading the selected file. Keep this page open.",
  success: "The file upload completed successfully.",
  error: "The file could not be uploaded. Review the guidance and try again.",
  denied: "You do not have permission to upload files in this context."
};

function formatMegabytes(bytes: number) {
  return Math.max(1, Math.round(bytes / (1024 * 1024)));
}

export function FileUploadField({
  id,
  label,
  description,
  error,
  required = false,
  maxSizeBytes,
  status = "idle",
  statusMessage,
  onFilesSelected,
  disabled,
  multiple,
  className = "",
  ...inputProps
}: FileUploadFieldProps) {
  const [clientError, setClientError] = useState<string>();
  const [selectedCount, setSelectedCount] = useState(0);
  const effectiveError = error || clientError;
  const unavailable = disabled || status === "uploading" || status === "denied";

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    const oversized = maxSizeBytes ? files.some((file) => file.size > maxSizeBytes) : false;

    if (oversized && maxSizeBytes) {
      setClientError(`A selected file exceeds the ${formatMegabytes(maxSizeBytes)} MB client-side limit.`);
      setSelectedCount(0);
      event.currentTarget.value = "";
      onFilesSelected?.([]);
      return;
    }

    setClientError(undefined);
    setSelectedCount(files.length);
    onFilesSelected?.(files);
  }

  const idleMessage = selectedCount === 0
    ? "No file selected."
    : `${selectedCount} ${selectedCount === 1 ? "file" : "files"} selected for local review.`;
  const visibleStatus = status === "idle" ? idleMessage : statusMessage || defaultStatusMessages[status];

  return (
    <div className="upload-field" aria-busy={status === "uploading"}>
      <FieldFrame id={id} label={label} description={description} error={effectiveError} required={required}>
        {({ describedBy, invalid }) => (
          <input
            {...inputProps}
            id={id}
            className={["form-control", "form-control--file", className].filter(Boolean).join(" ")}
            type="file"
            required={required}
            multiple={multiple}
            disabled={unavailable}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            onChange={handleChange}
          />
        )}
      </FieldFrame>
      <p
        className={`upload-field__status upload-field__status--${status}`}
        role={status === "error" ? "alert" : "status"}
        aria-live={status === "error" ? "assertive" : "polite"}
      >
        {visibleStatus}
      </p>
    </div>
  );
}
