import { StatesClasses } from './grid.constants';

export const enum FindingsTagStates {
  Cat1Major = 'CAT1 (Major)',
  Cat2Minor = 'CAT2 (Minor)',
  Observation = 'Observation',
  NoteWorthyEffort = 'Noteworthy Effort',
  OpportunityForImprovement = 'Opportunity for Improvement',
}

export const FINDINGS_TAG_STATES_MAP: Record<string, string> = {
  [FindingsTagStates.Cat1Major]: StatesClasses.MistyRose,
  [FindingsTagStates.Cat2Minor]: StatesClasses.LightYellow,
  [FindingsTagStates.Observation]: StatesClasses.LightCyan,
  [FindingsTagStates.NoteWorthyEffort]: StatesClasses.PastelGreen,
};

export const enum FindingsStatusStates {
  Open = 'Open',
  Accepted = 'Accepted',
  Closed = 'Closed',
}

export const FINDINGS_STATUS_STATES_MAP: Record<string, string> = {
  [FindingsStatusStates.Open.toLowerCase()]: StatesClasses.SunflowerYellow,
  [FindingsStatusStates.Accepted.toLowerCase()]: StatesClasses.FernGreen,
  [FindingsStatusStates.Closed.toLowerCase()]: StatesClasses.AshGrey,
};
