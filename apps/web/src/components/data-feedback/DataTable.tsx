import type { Key, ReactNode } from "react";
import { ApplicationState, type ApplicationStateKind } from "./ApplicationState";

export interface DataColumn<Row> {
  id: string;
  header: string;
  render: (row: Row) => ReactNode;
  rowHeader?: boolean;
  align?: "start" | "center" | "end";
}

export type DataTableState = "ready" | Extract<ApplicationStateKind, "loading" | "error" | "denied">;

export interface DataTableProps<Row> {
  caption: string;
  columns: DataColumn<Row>[];
  rows: Row[];
  getRowKey: (row: Row) => Key;
  state?: DataTableState;
  stateTitle?: string;
  stateMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  emptyActions?: ReactNode;
}

const defaultStateCopy: Record<Exclude<DataTableState, "ready">, { title: string; message: string }> = {
  loading: {
    title: "Loading records",
    message: "The latest authorized records are being requested."
  },
  error: {
    title: "Records could not be loaded",
    message: "Try again or use the approved support route if the problem continues."
  },
  denied: {
    title: "Records are not available",
    message: "Your current role or assignment does not authorize this view."
  }
};

export function DataTable<Row>({
  caption,
  columns,
  rows,
  getRowKey,
  state = "ready",
  stateTitle,
  stateMessage,
  emptyTitle = "No records found",
  emptyMessage = "Adjust the filters or create a record if your role permits it.",
  emptyActions
}: DataTableProps<Row>) {
  if (state !== "ready") {
    const copy = defaultStateCopy[state];
    return (
      <ApplicationState
        kind={state}
        title={stateTitle ?? copy.title}
        message={stateMessage ?? copy.message}
        compact
      />
    );
  }

  if (rows.length === 0) {
    return (
      <ApplicationState
        kind="empty"
        title={emptyTitle}
        message={emptyMessage}
        actions={emptyActions}
        compact
      />
    );
  }

  return (
    <div className="data-table-region" role="region" aria-label={`${caption} table`} tabIndex={0}>
      <table className="data-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col" data-align={column.align ?? "start"}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => {
                const Cell = column.rowHeader ? "th" : "td";
                return (
                  <Cell
                    key={column.id}
                    scope={column.rowHeader ? "row" : undefined}
                    data-align={column.align ?? "start"}
                  >
                    {column.render(row)}
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
