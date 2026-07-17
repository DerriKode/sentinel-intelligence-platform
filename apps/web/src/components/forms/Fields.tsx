import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { FieldFrame } from "./FieldFrame";

interface SharedFieldProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
}

function mergeDescriptionIds(generated: string | undefined, supplied: string | undefined) {
  return [generated, supplied].filter(Boolean).join(" ") || undefined;
}

export interface TextFieldProps
  extends SharedFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "required"> {}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { id, label, description, error, required = false, className = "", "aria-describedby": suppliedDescription, ...inputProps },
  ref
) {
  return (
    <FieldFrame id={id} label={label} description={description} error={error} required={required}>
      {({ describedBy, invalid }) => (
        <input
          {...inputProps}
          ref={ref}
          id={id}
          className={["form-control", className].filter(Boolean).join(" ")}
          required={required}
          aria-describedby={mergeDescriptionIds(describedBy, suppliedDescription)}
          aria-invalid={invalid ? true : inputProps["aria-invalid"] ?? false}
        />
      )}
    </FieldFrame>
  );
});

export interface SelectFieldProps
  extends SharedFieldProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "required"> {}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { id, label, description, error, required = false, className = "", "aria-describedby": suppliedDescription, children, ...selectProps },
  ref
) {
  return (
    <FieldFrame id={id} label={label} description={description} error={error} required={required}>
      {({ describedBy, invalid }) => (
        <select
          {...selectProps}
          ref={ref}
          id={id}
          className={["form-control", "form-control--select", className].filter(Boolean).join(" ")}
          required={required}
          aria-describedby={mergeDescriptionIds(describedBy, suppliedDescription)}
          aria-invalid={invalid ? true : selectProps["aria-invalid"] ?? false}
        >
          {children}
        </select>
      )}
    </FieldFrame>
  );
});

export interface TextAreaFieldProps
  extends SharedFieldProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "required"> {}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(function TextAreaField(
  { id, label, description, error, required = false, className = "", "aria-describedby": suppliedDescription, ...textAreaProps },
  ref
) {
  return (
    <FieldFrame id={id} label={label} description={description} error={error} required={required}>
      {({ describedBy, invalid }) => (
        <textarea
          {...textAreaProps}
          ref={ref}
          id={id}
          className={["form-control", "form-control--textarea", className].filter(Boolean).join(" ")}
          required={required}
          aria-describedby={mergeDescriptionIds(describedBy, suppliedDescription)}
          aria-invalid={invalid ? true : textAreaProps["aria-invalid"] ?? false}
        />
      )}
    </FieldFrame>
  );
});
