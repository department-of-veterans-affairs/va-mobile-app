import { css } from 'styled-components'

import { VATheme } from 'styles/theme'

// type ThemeType<T> = T & { theme: VATheme }
// type ThemeItValue = string | number
// type ThemePropFn<T> = (theme: VATheme, otherProps: T) => ThemeItValue
// type ThemeFnOuter<T> = (props: ThemeType<T>) => ThemeItValue

/**
 * Helper function for react styled, takes in a lambda with theme as the prop
 */

type ThemeFn<P> = (theme: VATheme, props: P) => string

export const themeFn = <P>(fn: ThemeFn<P>) => {
  return (props: P & { theme: VATheme }) => css`
    ${fn(props.theme, props)}
  `
}
