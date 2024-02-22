/**
  Returns a string that replaces unicode/whitespace markup in json strings
  \n Newline
  \r Carriage Return
  \t Tab
  \u2022 Bullet Points
  @param text - array of textline to concatenate
  */

export const fixedWhiteSpaceString = (text: string | undefined) => {
  if (text) {
    return text
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\u2022/g, '\u2022')
  }
  return ''
}
