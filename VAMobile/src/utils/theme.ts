import { css } from 'styled-components'

import { VATheme } from 'styles/theme'

/**
 * Helper function for react styled, takes in a lambda with theme as the prop
 */

type ThemeFn<P> = (theme: VATheme, props: P) => string | number

export const themeFn = <P>(fn: ThemeFn<P>) => {
  return (props: P & { theme: VATheme }) => css`
    ${fn(props.theme, props)}
  `
}
