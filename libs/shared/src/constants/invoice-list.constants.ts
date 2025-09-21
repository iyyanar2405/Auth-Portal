import { StatesClasses } from './grid.constants';

export const enum InvoicesStatusStates {
  Paid = 'Paid',
  PartiallyPaid = 'Partially Paid',
  NotPaid = 'Not Paid',
  Overdue = 'Overdue',
  Cancelled = 'Cancelled',
  CreditNote = 'Credit Note',
}

export const INVOICES_STATUS_MAP: Record<string, string> = {
  [InvoicesStatusStates.Paid.toLowerCase()]: StatesClasses.FernGreen,
  [InvoicesStatusStates.PartiallyPaid.toLocaleLowerCase()]:
    StatesClasses.GraphOrange,
  [InvoicesStatusStates.NotPaid.toLowerCase()]: StatesClasses.SunflowerYellow,
  [InvoicesStatusStates.Overdue.toLowerCase()]: StatesClasses.FirebrickRed,
  [InvoicesStatusStates.Cancelled.toLowerCase()]: StatesClasses.AshGrey,
  [InvoicesStatusStates.CreditNote.toLowerCase()]: StatesClasses.DarkerCyan,
};
