import { addDays, format, isBefore, isEqual, isValid, parse } from 'date-fns'
import facilities from 'vets-json-schema/dist/vaMedicalFacilities.json'

import { MedicalCenter, MedicalCopayRecord } from 'api/types/MedicalCopayData'

export const DUE_DATE_DAYS = 30

type FacilitiesByState = Record<string, MedicalCenter[]>

const vaMedicalFacilities = facilities as FacilitiesByState

// Merges all the state facilities into one object with values as keys
// and labels as values.
// For example, with input:
// {
//   "VT": [
//     {
//       "value": "405HK",
//       "label": "WHITE RIVER JUNCTION MORC"
//     },
//     {
//       "value": "405GA",
//       "label": "Bennington VA Clinic"
//     }
//   ]
// }
// will return:
// {
//   "405HK": "WHITE RIVER JUNCTION MORC",
//   "405GA": "Bennington VA Clinic"
// }
export const medicalCenterLabels: Record<string, string> = Object.values(vaMedicalFacilities).reduce(
  (acc, centers) => {
    for (const { value, label } of centers) {
      acc[value] = label
    }
    return acc
  },
  {} as Record<string, string>,
)

/**
 * Gets the medical center name by facility ID
 * @param facilityId - facility id in the form: `'123 - ABCD'` or `'123F'` where the id to look up is the first part of the string
 * @returns either the actual name of the medical center or the passed in id if no match was found
 */
export function getMedicalCenterNameByID(facilityId?: string | null): string {
  if (!facilityId) return ''

  // Grab the first segment before " - " (or the whole string if not present)
  const [id] = facilityId.split(' - ')
  return medicalCenterLabels[id] ?? facilityId
}

// DATE UTILITIES

/**
 * Parses a date string in MM/DD/YYYY format
 */
const parseDateString = (dateStr: string): Date | null => {
  const cleaned = dateStr.replace(/\u00A0/g, ' ').trim()

  // Prefer explicit MM/DD/YYYY parse
  const mdy = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(cleaned)
  if (mdy) {
    const [, mm, dd, yyyy] = mdy
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd))
  }

  return null
}

/**
w * Parses a date string into a Date object
 */
const parseDateValue = (val?: string | null): Date | null => {
  if (val == null) return null

  // Try explicit MM/DD/YYYY parsing first
  const parsed = parseDateString(String(val))
  if (parsed) return parsed

  // Fallback for ISO-like strings
  const fallbackParsed = Date.parse(String(val))
  return Number.isFinite(fallbackParsed) ? new Date(fallbackParsed) : null
}

/**
 * Converts a date string to timestamp
 */
const toTime = (val?: string | null): number => {
  const date = parseDateValue(val)
  return date ? date.getTime() : Number.NEGATIVE_INFINITY
}

/**
 * Formats a date string for display
 */
export const formatDate = (date: string | null | undefined): string => {
  if (!date) return ''

  // Trim and remove NBSP to avoid hidden-char parse failures
  const d = parse(date.replace(/\u00A0/g, ' ').trim(), 'MM/dd/yyyy', new Date())

  return isValid(d) ? format(d, 'MMMM d, yyyy') : ''
}

/**
 * Calculates a due date by adding days to a given date string
 */
export const calcDueDate = (date: string, days: number): string => {
  const parsedDate = parseDateValue(date)
  if (!parsedDate) return ''
  return formatDate(format(addDays(parsedDate, days), 'MM/dd/yyyy'))
}

/**
 * Verifies if a balance is current (not past due)
 */
export const verifyCurrentBalance = (date: string): boolean => {
  const currentDate = new Date()
  const parsedDate = parseDateValue(date)
  if (!parsedDate) return false

  const dueDate = addDays(parsedDate, DUE_DATE_DAYS)
  return isBefore(currentDate, dueDate) || isEqual(currentDate, dueDate)
}

// ARRAY UTILITIES

/**
 * Sorts copay statements by date (newest first)
 */
export const sortStatementsByDate = (statements: MedicalCopayRecord[]): MedicalCopayRecord[] => {
  const sorted = [...statements].sort((a, b) => toTime(b.pSStatementDateOutput) - toTime(a.pSStatementDateOutput))
  return sorted
}

/**
 * Creates a new array with unique items based on a key function
 */
export function uniqBy<T, K>(arr: T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>()
  const result: T[] = []

  for (const item of arr) {
    const key = keyFn(item)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }

  return result
}
