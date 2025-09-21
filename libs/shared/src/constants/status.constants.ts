import { StatesClasses } from './grid.constants';

export const enum StatusStates {
  ToBeConfirmed = 'To be confirmed',
  Confirmed = 'Confirmed',
  FindingsOpen = 'Findings Open',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export const STATUS_STATES_MAP: Record<string, string> = {
  [StatusStates.ToBeConfirmed.toLowerCase()]: StatesClasses.VividOrange,
  [StatusStates.Confirmed.toLowerCase()]: StatesClasses.SummerSky,
  [StatusStates.FindingsOpen.toLowerCase()]: StatesClasses.FirebrickRed,
  [StatusStates.InProgress.toLowerCase()]: StatesClasses.SunflowerYellow,
  [StatusStates.Completed.toLowerCase()]: StatesClasses.FernGreen,
  [StatusStates.Cancelled.toLowerCase()]: StatesClasses.AshGrey,
};
