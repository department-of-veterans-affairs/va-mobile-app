import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { AppThunk } from 'store'

import theme from 'styles/themes/standardTheme'

export type SnackBarState = {
  bottomOffset: number
}

export const initialSnackBarState = {
  bottomOffset: theme.dimensions.snackBarBottomOffset,
}

/**
 * Redux action to update bottom offset
 */
export const updatBottomOffset =
  (bottomOffset: number): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchUpdatBottomOffset(bottomOffset))
  }

const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState: initialSnackBarState,
  reducers: {
    dispatchUpdatBottomOffset: (state, action: PayloadAction<number>) => {
      state.bottomOffset = action.payload
    },
  },
})

export const { dispatchUpdatBottomOffset } = snackBarSlice.actions
export default snackBarSlice.reducer
