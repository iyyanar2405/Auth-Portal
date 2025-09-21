import { GridConfig, SortingConfig, SortingMode } from '../models';

export const COLUMN_DELIMITER = ' || ';

export const enum StatesClasses {
  MistyRose = 'misty-rose',
  LightYellow = 'light-yellow',
  LightCyan = 'light-cyan',
  PastelGreen = 'pastel-green',
  SunflowerYellow = 'sunflower-yellow',
  FernGreen = 'fern-green',
  AshGrey = 'ash-grey',
  VividOrange = 'vivid-orange',
  GraphOrange = 'graph-orange',
  SummerSky = 'summer-sky',
  FirebrickRed = 'firebrick-red',
  ForestGreen = 'forest-green',
  SunshineYellow = 'sunshine-yellow',
  CrimsonFlame = 'crimson-flame',
  PewterGray = 'pewter-gray',
  DarkerCyan = 'darker-cyan',
}

export const DEFAULT_SORTING_CONFIG: SortingConfig = {
  mode: SortingMode.Multiple,
  rules: [],
};

export const DEFAULT_GRID_CONFIG: GridConfig = {
  pagination: {
    paginationEnabled: true,
    pageSize: 10,
    startIndex: 0,
  },
  sorting: DEFAULT_SORTING_CONFIG,
  filtering: {},
};

export const BLANK_FILTER = 'BLANK';
