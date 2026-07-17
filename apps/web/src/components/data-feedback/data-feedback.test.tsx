import { useState } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "../forms";
import dataFeedbackStyles from "./data-feedback.css?raw";
import {
  Alert,
  ApplicationState,
  Badge,
  DataCard,
  DataFeedbackPreview,
  DataTable,
  Drawer,
  FilterBar,
  Metric,
  ModalDialog,
  Pagination,
  type ApplicationStateKind,
  type DataColumn
} from "./index";

interface TestRow {
  id: string;
  status: string;
}

const testColumns: DataColumn<TestRow>[] = [
  { id: "reference", header: "Reference", rowHeader: true, render: (row) => row.id },
  { id: "status", header: "Status", render: (row) => <Badge tone="success">{row.status}</Badge> }
];

describe("shared data and feedback components", () => {
  it("provides named cards, semantic metrics, and text-bearing badges", () => {
    render(
      <DataCard title="Review queue" eyebrow="Synthetic">
        <Metric label="Visible rows" value={3} description="Local sample only." />
        <Badge tone="warning">Review required</Badge>
      </DataCard>
    );

    expect(screen.getByRole("article", { name: "Review queue" })).toBeVisible();
    expect(screen.getByText("Visible rows").tagName).toBe("DT");
    expect(screen.getByText("3").tagName).toBe("DD");
    expect(screen.getByText("Review required")).toHaveClass("data-badge--warning");
  });

  it("announces errors assertively and supports an explicit dismiss action", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Alert tone="error" title="Could not load records" onDismiss={onDismiss}>
        <p>Try again later.</p>
      </Alert>
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Error");
    expect(screen.getByRole("alert")).toHaveTextContent("Could not load records");
    await user.click(screen.getByRole("button", { name: "Dismiss message" }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it.each([
    ["loading", "status", "true"],
    ["empty", "status", "false"],
    ["error", "alert", "false"],
    ["success", "status", "false"],
    ["denied", "status", "false"],
    ["validation", "alert", "false"]
  ] as const)("renders the %s application state with safe announcement semantics", (kind, role, busy) => {
    render(<ApplicationState kind={kind as ApplicationStateKind} title={`${kind} title`} message="Safe message." />);

    const state = screen.getByRole(role);
    expect(state).toHaveTextContent(`${kind} title`);
    expect(state).toHaveAttribute("aria-busy", busy);
    expect(state).toHaveAttribute("aria-atomic", "true");
  });

  it("renders captioned native table headers and a keyboard-focusable scroll region", () => {
    render(
      <DataTable
        caption="Authorized records"
        columns={testColumns}
        rows={[{ id: "SYN-001", status: "Ready" }]}
        getRowKey={(row) => row.id}
      />
    );

    expect(screen.getByRole("region", { name: "Authorized records table" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByText("Authorized records").tagName).toBe("CAPTION");
    expect(screen.getByRole("columnheader", { name: "Reference" })).toHaveAttribute("scope", "col");
    expect(screen.getByRole("rowheader", { name: "SYN-001" })).toHaveAttribute("scope", "row");
  });

  it("uses explicit empty and denied table states without exposing a table", () => {
    const { rerender } = render(
      <DataTable
        caption="Scoped records"
        columns={testColumns}
        rows={[]}
        getRowKey={(row) => row.id}
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("No records found");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();

    rerender(
      <DataTable
        caption="Scoped records"
        columns={testColumns}
        rows={[]}
        getRowKey={(row) => row.id}
        state="denied"
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Records are not available");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("submits and clears a named filter form with an announced count", async () => {
    const user = userEvent.setup();
    const onApply = vi.fn();
    const onClear = vi.fn();
    render(
      <FilterBar label="Filter records" activeFilterCount={1} onApply={onApply} onClear={onClear}>
        <TextField id="query" label="Search" />
      </FilterBar>
    );

    const search = screen.getByRole("search", { name: "Filter records" });
    expect(within(search).getByRole("status")).toHaveTextContent("1 filter applied");
    await user.type(within(search).getByRole("textbox", { name: "Search" }), "synthetic{Enter}");
    expect(onApply).toHaveBeenCalledOnce();
    await user.click(within(search).getByRole("button", { name: "Clear filters" }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("marks the current page and prevents navigation beyond available pages", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination currentPage={2} totalPages={4} onPageChange={onPageChange} />);

    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
    await user.click(screen.getByRole("button", { name: "Page 4" }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("contains dialog focus, closes on Escape, and restores the trigger", async () => {
    const user = userEvent.setup();

    function DialogHarness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Launch dialog</button>
          <ModalDialog
            open={open}
            title="Shared guidance"
            onClose={() => setOpen(false)}
            actions={<button type="button">Last dialog action</button>}
          >
            <p>Safe context.</p>
          </ModalDialog>
        </>
      );
    }

    render(<DialogHarness />);
    const launch = screen.getByRole("button", { name: "Launch dialog" });
    await user.click(launch);
    const close = screen.getByRole("button", { name: "Close dialog" });
    await waitFor(() => expect(close).toHaveFocus());
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Last dialog action" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(launch).toHaveFocus());
  });

  it("gives drawers modal naming, Escape behavior, and trigger-focus restoration", async () => {
    const user = userEvent.setup();

    function DrawerHarness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>Launch drawer</button>
          <Drawer open={open} title="Record context" onClose={() => setOpen(false)}>
            <a href="#safe-target">Context link</a>
          </Drawer>
        </>
      );
    }

    render(<DrawerHarness />);
    const launch = screen.getByRole("button", { name: "Launch drawer" });
    await user.click(launch);
    expect(screen.getByRole("dialog", { name: "Record context" })).toHaveAttribute("aria-modal", "true");
    await waitFor(() => expect(screen.getByRole("button", { name: "Close drawer" })).toHaveFocus());
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(launch).toHaveFocus());
  });

  it("integrates filtering, pagination, dialogs, and drawers over synthetic local rows", async () => {
    const user = userEvent.setup();
    render(<DataFeedbackPreview />);

    const preview = screen.getByRole("region", { name: "Data and feedback" });
    expect(within(preview).getByRole("rowheader", { name: "SYN-001" })).toBeVisible();
    await user.click(within(preview).getByRole("button", { name: "Page 2" }));
    expect(within(preview).getByRole("rowheader", { name: "SYN-005" })).toBeVisible();

    await user.type(within(preview).getByRole("textbox", { name: "Search" }), "audit");
    await user.click(within(preview).getByRole("button", { name: "Apply filters" }));
    expect(within(preview).getByRole("rowheader", { name: "SYN-005" })).toBeVisible();
    expect(within(preview).queryByRole("rowheader", { name: "SYN-004" })).not.toBeInTheDocument();

    await user.click(within(preview).getByRole("button", { name: "Open dialog" }));
    expect(screen.getByRole("dialog", { name: "Synthetic record guidance" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Close dialog" }));

    await user.click(within(preview).getByRole("button", { name: "Open drawer" }));
    expect(screen.getByRole("dialog", { name: "Synthetic record context" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Close drawer" }));
  });

  it("uses design tokens and includes responsive, coarse-pointer, and forced-color rules", () => {
    expect(dataFeedbackStyles).not.toMatch(/#[0-9a-f]{3,8}\b|\brgba?\(/i);
    expect(dataFeedbackStyles).toContain("@media (max-width: 52.5rem)");
    expect(dataFeedbackStyles).toContain("@media (max-width: 40rem)");
    expect(dataFeedbackStyles).toContain("@media (pointer: coarse)");
    expect(dataFeedbackStyles).toContain("@media (forced-colors: active)");
  });
});
