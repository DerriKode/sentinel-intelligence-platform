import { useMemo, useState } from "react";
import { Button, SelectField, TextField } from "../forms";
import { Alert } from "./Alert";
import { ApplicationState, type ApplicationStateKind } from "./ApplicationState";
import { Badge, type BadgeTone } from "./Badge";
import { DataCard, Metric } from "./Cards";
import { DataTable, type DataColumn } from "./DataTable";
import { Drawer } from "./Drawer";
import { FilterBar } from "./FilterBar";
import { ModalDialog } from "./ModalDialog";
import { Pagination } from "./Pagination";

interface SyntheticRecord {
  id: string;
  type: string;
  status: "Ready" | "Review" | "Restricted";
  updated: string;
}

const syntheticRecords: SyntheticRecord[] = [
  { id: "SYN-001", type: "Case preview", status: "Ready", updated: "17 Jul 2026" },
  { id: "SYN-002", type: "Evidence preview", status: "Review", updated: "17 Jul 2026" },
  { id: "SYN-003", type: "Report preview", status: "Restricted", updated: "16 Jul 2026" },
  { id: "SYN-004", type: "Alert preview", status: "Ready", updated: "16 Jul 2026" },
  { id: "SYN-005", type: "Audit preview", status: "Review", updated: "15 Jul 2026" }
];

const badgeTones: Record<SyntheticRecord["status"], BadgeTone> = {
  Ready: "success",
  Review: "warning",
  Restricted: "denied"
};

const columns: DataColumn<SyntheticRecord>[] = [
  {
    id: "reference",
    header: "Reference",
    rowHeader: true,
    render: (record) => record.id
  },
  {
    id: "type",
    header: "Type",
    render: (record) => record.type
  },
  {
    id: "status",
    header: "Status",
    render: (record) => <Badge tone={badgeTones[record.status]}>{record.status}</Badge>
  },
  {
    id: "updated",
    header: "Updated",
    render: (record) => record.updated
  }
];

const stateLabels: Record<ApplicationStateKind, string> = {
  loading: "Loading",
  empty: "Empty",
  error: "Error",
  success: "Success",
  denied: "Permission denied",
  validation: "Validation"
};

const stateCopy: Record<ApplicationStateKind, { title: string; message: string }> = {
  loading: {
    title: "Loading the authorized view",
    message: "Current data is being requested. Existing content is not presented as fresh."
  },
  empty: {
    title: "No records are available",
    message: "There is no authorized content for this view or filter selection."
  },
  error: {
    title: "The view could not be loaded",
    message: "Try again or use the approved support route. No internal error details are exposed."
  },
  success: {
    title: "The action completed",
    message: "The interface confirms completion without implying authority beyond the server result."
  },
  denied: {
    title: "This view is not available",
    message: "The current role or assignment does not authorize access."
  },
  validation: {
    title: "Review the highlighted information",
    message: "Correct the identified fields before attempting the action again."
  }
};

const pageSize = 3;

export function DataFeedbackPreview() {
  const [noticeVisible, setNoticeVisible] = useState(true);
  const [draftQuery, setDraftQuery] = useState("");
  const [draftStatus, setDraftStatus] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeState, setActiveState] = useState<ApplicationStateKind>("success");

  const filteredRecords = useMemo(() => {
    const query = appliedQuery.trim().toLowerCase();
    return syntheticRecords.filter((record) => {
      const matchesQuery = !query || `${record.id} ${record.type}`.toLowerCase().includes(query);
      const matchesStatus = !appliedStatus || record.status === appliedStatus;
      return matchesQuery && matchesStatus;
    });
  }, [appliedQuery, appliedStatus]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const pageRows = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const activeFilterCount = Number(Boolean(appliedQuery)) + Number(Boolean(appliedStatus));

  function applyFilters() {
    setAppliedQuery(draftQuery);
    setAppliedStatus(draftStatus);
    setCurrentPage(1);
  }

  function clearFilters() {
    setDraftQuery("");
    setDraftStatus("");
    setAppliedQuery("");
    setAppliedStatus("");
    setCurrentPage(1);
  }

  return (
    <section className="panel data-feedback-preview" id="data-feedback-components" aria-labelledby="data-feedback-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Shared components</p>
          <h2 id="data-feedback-title">Data and feedback</h2>
        </div>
        <span className="panel-index">S2 / 06</span>
      </div>

      {noticeVisible && (
        <Alert
          title="Synthetic component preview"
          onDismiss={() => setNoticeVisible(false)}
          dismissLabel="Dismiss synthetic preview notice"
        >
          <p>These local examples contain no operational, personal, evidence, or API data.</p>
        </Alert>
      )}

      <div className="data-feedback-preview__metrics" aria-label="Synthetic preview metrics">
        <DataCard title="Visible records" eyebrow="Current page">
          <Metric
            label="Rows displayed"
            value={pageRows.length}
            description="Derived only from the local synthetic sample."
          />
        </DataCard>
        <DataCard title="Filter posture" eyebrow="Current view">
          <Metric
            label="Applied filters"
            value={activeFilterCount}
            description="A UI count, not an operational performance measure."
          />
        </DataCard>
      </div>

      <DataCard
        title="Synthetic record table"
        eyebrow="Table, filters, pagination"
        actions={(
          <div className="data-card__button-group">
            <Button variant="secondary" onClick={() => setDialogOpen(true)}>Open dialog</Button>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>Open drawer</Button>
          </div>
        )}
      >
        <FilterBar
          label="Filter synthetic records"
          activeFilterCount={activeFilterCount}
          onApply={applyFilters}
          onClear={clearFilters}
        >
          <TextField
            id="synthetic-query"
            label="Search"
            value={draftQuery}
            onChange={(event) => setDraftQuery(event.target.value)}
            placeholder="Reference or type"
          />
          <SelectField
            id="synthetic-status"
            label="Status"
            value={draftStatus}
            onChange={(event) => setDraftStatus(event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="Ready">Ready</option>
            <option value="Review">Review</option>
            <option value="Restricted">Restricted</option>
          </SelectField>
        </FilterBar>

        <DataTable
          caption="Synthetic records"
          columns={columns}
          rows={pageRows}
          getRowKey={(record) => record.id}
          emptyTitle="No synthetic records match"
          emptyMessage="Clear or adjust the local preview filters."
          emptyActions={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          label="Synthetic records pagination"
        />
      </DataCard>

      <DataCard title="Application states" eyebrow="Reusable feedback">
        <div className="state-switcher state-switcher--compact" role="group" aria-label="Application state component preview">
          {(Object.keys(stateLabels) as ApplicationStateKind[]).map((state) => (
            <button
              className={`state-button${activeState === state ? " state-button--active" : ""}`}
              key={state}
              type="button"
              aria-pressed={activeState === state}
              onClick={() => setActiveState(state)}
            >
              {stateLabels[state]}
            </button>
          ))}
        </div>
        <ApplicationState
          kind={activeState}
          title={stateCopy[activeState].title}
          message={stateCopy[activeState].message}
          actions={activeState === "error" ? <Button variant="secondary">Try again</Button> : undefined}
        />
      </DataCard>

      <ModalDialog
        open={dialogOpen}
        title="Synthetic record guidance"
        description="A shared informational dialog with explicit focus and close behavior."
        onClose={() => setDialogOpen(false)}
        actions={<Button onClick={() => setDialogOpen(false)}>Acknowledge guidance</Button>}
      >
        <p>Dialogs provide focused context. They do not grant access or confirm that a protected record exists.</p>
      </ModalDialog>

      <Drawer
        open={drawerOpen}
        title="Synthetic record context"
        description="A responsive contextual drawer for secondary information."
        onClose={() => setDrawerOpen(false)}
        footer={<Button variant="secondary" onClick={() => setDrawerOpen(false)}>Return to table</Button>}
      >
        <dl className="data-drawer__details">
          <div><dt>Reference</dt><dd>SYN-001</dd></div>
          <div><dt>Classification</dt><dd>Synthetic preview only</dd></div>
          <div><dt>Authority</dt><dd>No operational authority</dd></div>
        </dl>
      </Drawer>
    </section>
  );
}
