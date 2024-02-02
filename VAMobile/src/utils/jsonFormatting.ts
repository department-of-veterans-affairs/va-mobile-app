/**
  Returns a string that replaces unicode/whitespace markup in json strings
  \n Newline
  \r Carriage Return
  \u2028 Line Separator
  \u2029 Paragraph Separator
  \t Tab
  \v Vertical Tab
  \u2022 Bullet Points
  @param text - array of textline to concatenate
  */

export const fixedWhiteSpaceString = (text: string | undefined) => {
  if (text) {
    return text
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\v/g, '\v')
      .replace(/\\u2028/g, '\u2028')
      .replace(/\\u2029/g, '\u2029')
      .replace(/\\u2022/g, '\u2022')
  }
  return ''
}
