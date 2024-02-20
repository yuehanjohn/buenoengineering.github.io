const YEARS_LIST_RANGE = {
  min: 1900,
  max: 2100,
} as const;
export const YEARS_LIST = Array(YEARS_LIST_RANGE.max - YEARS_LIST_RANGE.min + 1)
  .fill(0)
  .map((_, ind) => YEARS_LIST_RANGE.min + ind);

export const DAY_NAMES = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export const MONTH_NAMES = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

export const TranslationKeys = {
  namespace: 'datePicker',
  datePicker_selected_year: 'datePicker_selected_year',
  datePicker_selected_year_placeholder: '{selected year}',
  datePicker_selected_month_year: 'datePicker_selected_month_year',
  datePicker_selected_month_year_placeholder: '{selected month year}',
  datePicker_invalid_date: 'datePicker_invalid_date',
  datePicker_calendar_error: 'datePicker_calendar_error',
};

export const DEFAULT_TRANSLATIONS = {
  previousMonthNav: 'Previous Month',
  nextMonthNav: 'Next Month',
  previousYearNav: 'Previous Year',
  nextYearNav: 'Next Year',
  selected_year: `Years, ${TranslationKeys.datePicker_selected_year_placeholder} selected`,
  selected_month_year: `${TranslationKeys.datePicker_selected_month_year_placeholder} selected`,
  datePicker_invalid_date: 'This date isn’t available. Try another.',
  datePicker_calendar_error:
    'It looks like there was a technical problem. Refresh the page and try again.',
  titleContent: 'Open calendar',
} as const;

export const SKIN_NAMES = [
  'DatePickerDefaultSkin',
  'DatePickerTextBetweenNavSkin',
  'DatePickerTextYearNavSkin',
] as const;
