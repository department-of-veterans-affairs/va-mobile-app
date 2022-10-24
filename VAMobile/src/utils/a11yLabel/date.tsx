import { formatDateMMMMDDYYYY, formatDateUtc } from '../formattingUtils'

/**
 * Converts number date(ex. 01/20/2023) to January 20, 2023 UTC
 * @param date - i.e. 2013-06-06T04:00:00.000+00:00
 * 01/20/2023 into January 20, 2023
 */
// TODO do we want this or just use the format function straight from 'formattingUtils.tsx'?
export const a11yLabelDateUTC = (date: string): string => {
  return formatDateUtc(date, 'MMMM dd, yyyy')
}

/**
 * Converts number date(ex. 01/20/2023) to January 20, 2023 local
 * @param date - i.e. 2013-06-06T04:00:00.000+00:00
 * 01/20/2023 into January 20, 2023
 */
// TODO do we want this or just use the format function straight from 'formattingUtils.tsx'?
export const a11yLabelDateLocal = (date: string): string => {
  return formatDateMMMMDDYYYY(date)
}
