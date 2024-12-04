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

export const fixSpecialCharacters = (text: string): string => {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&ldquo;/g, '"')
    .replace(/&rsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&#39;/g, "'")
}
