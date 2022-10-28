/**
 * Inserts spaces between every character so screen reader reads each individual character
 * @param id - string representing a string id
 * 3123DAD into 3 1 2 3 D A D
 */
export const a11yLabelID = (id?: string): string => {
  if (!id) {
    return ''
  }

  // do not use dashes - will sometimes actually pronounce the dash
  return id.split('').join(' ')
}
