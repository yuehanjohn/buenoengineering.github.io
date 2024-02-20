const YEARS_LIST_RANGE = {
  min: 1900,
  max: 2100,
} as const;

export const YEARS_LIST = Array(YEARS_LIST_RANGE.max - YEARS_LIST_RANGE.min + 1)
  .fill(0)
  .map((_, ind) => YEARS_LIST_RANGE.min + ind);
