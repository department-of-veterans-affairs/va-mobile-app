import createReducer from './createReducer'
import theme from 'styles/themes/standardTheme'

export type SnackBarState = {
  bottomOffset: number
}

export const initialSnackBarState = {
  bottomOffset: theme.dimensions.snackBarBottomOffset,
}

export default createReducer<SnackBarState>(initialSnackBarState, {
  BOTTOM_OFFSET_UPDATE: (state, { bottomOffset }) => {
    return {
      ...state,
      bottomOffset,
    }
  },
})
