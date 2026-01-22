import { StandardTextAreaBorder } from 'components'
import { VATheme } from 'styles/theme'

/**
 * This function expects that you've also passed in noBorder to the TextArea component
 * @param position - 'first' | 'last' | undefined - position of the TextArea in a series of TextAreas, undefined is a middle one
 * @returns boxProps for TextArea to style borders and box properties correctly
 */
export const textAreaBoxProps = (theme: VATheme, position?: 'first' | 'last') => {
  const { cardPadding } = theme.dimensions
  return {
    p: 0,
    px: cardPadding,
    ...StandardTextAreaBorder,
    ...(position === 'first'
      ? { borderBottomWidth: 0, pt: cardPadding }
      : position === 'last'
        ? { borderTopWidth: 0, pb: cardPadding }
        : {}),
  }
}
