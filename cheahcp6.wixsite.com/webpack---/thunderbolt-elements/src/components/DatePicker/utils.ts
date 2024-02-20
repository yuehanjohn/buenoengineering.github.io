import type { CompInfo } from '@wix/editor-elements-types/thunderbolt';
import { HtmlValidationMessageOverrideObject } from '@wix/editor-elements-corvid-utils';
import { DatePickerDefinition } from '@wix/thunderbolt-components';
import {
  DatePickerDateFormat,
  IDatePickerTranslations,
  DefaultTranslations,
} from './DatePicker.types';
import {
  DAY_NAMES,
  DEFAULT_TRANSLATIONS,
  MONTH_NAMES,
  TranslationKeys,
} from './constants';

export const getFormattedDate = (
  date: Date,
  format: DatePickerDateFormat,
): string => {
  const yyyy = `${date.getFullYear()}`;
  const m = `${date.getMonth() + 1}`;
  const d = `${date.getDate()}`;
  const mm = m.padStart(2, '0');
  const dd = d.padStart(2, '0');
  switch (format) {
    case 'DD/MM/YYYY':
      return `${dd}/${mm}/${yyyy}`;
    case 'MM/DD/YYYY':
      return `${mm}/${dd}/${yyyy}`;
    case 'YYYY/M/D':
      return `${yyyy}/${m}/${d}`;
    default:
      return `${yyyy}/${mm}/${dd}`;
  }
};

export const translateHtmlValidationMessage = (
  message: HtmlValidationMessageOverrideObject,
  { invalidDateValidationError }: IDatePickerTranslations,
): string => {
  switch (message.key) {
    case 'DATE_PICKER_INVALID_DATE':
      return invalidDateValidationError;

    default:
      return message.key;
  }
};

export const getAllTranslations = (
  translate: CompInfo<DatePickerDefinition>['translate'],
): IDatePickerTranslations => {
  const getTranslation = (key: string, defaultTranslation: string) =>
    translate('datePicker', `datePicker_${key}`) || defaultTranslation;

  const defaultTranslations = Object.entries(DEFAULT_TRANSLATIONS).reduce<
    Partial<DefaultTranslations>
  >((translations, [key, defaultTranslation]) => {
    return {
      ...translations,
      [key]: getTranslation(key, defaultTranslation),
    };
  }, {}) as DefaultTranslations;

  const dayNames = DAY_NAMES.map(day => {
    const longName = day[0].toUpperCase() + day.slice(1);
    const shortName = longName.substr(0, 2);
    const longNameKey = `day_${day}_reg`;
    const shortNameKey = `day_${day}`;
    return {
      shortName: getTranslation(shortNameKey, shortName),
      longName: getTranslation(longNameKey, longName),
    };
  });

  const monthNames = MONTH_NAMES.map(month => {
    const longName = month[0].toUpperCase() + month.slice(1);
    const shortName = longName.substr(0, 3);
    const longNameKey = `month_${month}`;
    const shortNameKey = `month_${month}_min`;
    return {
      shortName: getTranslation(shortNameKey, shortName),
      longName: getTranslation(longNameKey, longName),
    };
  });

  return {
    ...defaultTranslations,
    dayNames,
    monthNames,
    invalidDateValidationError:
      translate(
        TranslationKeys.namespace,
        TranslationKeys.datePicker_invalid_date,
      ) || DEFAULT_TRANSLATIONS.datePicker_invalid_date,
    calendarError:
      translate(
        TranslationKeys.namespace,
        TranslationKeys.datePicker_calendar_error,
      ) || DEFAULT_TRANSLATIONS.datePicker_calendar_error,
    selectedYearAriaLabel:
      translate(
        TranslationKeys.namespace,
        TranslationKeys.datePicker_selected_year,
      ) || DEFAULT_TRANSLATIONS.selected_year,
    selectedMonthAriaLabel:
      translate(
        TranslationKeys.namespace,
        TranslationKeys.datePicker_selected_month_year,
      ) || DEFAULT_TRANSLATIONS.selected_month_year,
  };
};
