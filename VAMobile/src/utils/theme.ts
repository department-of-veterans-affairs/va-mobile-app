import { VATheme } from 'styles/theme'

type ThemeType<T> = T & { theme: VATheme }
type ThemeItValue = string | number
type ThemePropFn<T> = (theme: VATheme, otherProps: T) => ThemeItValue
type ThemeFnOuter<T> = (props: ThemeType<T>) => ThemeItValue

/**
 * Helper function for react styled, takes in a lambda with theme as the prop
 */
export const themeFn = <T>(myfn: ThemePropFn<T>): ThemeFnOuter<T> => {
  const fn = (props: ThemeType<T>): ThemeItValue => {
    return myfn(props.theme, props as T)
  }
  return fn
}
