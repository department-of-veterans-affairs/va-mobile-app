import { VATheme } from 'styles/theme'
import { useTheme as styledComponentsUseTheme } from 'styled-components'

export const useTheme = styledComponentsUseTheme as () => VATheme
