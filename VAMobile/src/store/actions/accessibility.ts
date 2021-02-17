import { AsyncReduxAction, ReduxAction } from '../types'

const dispatchUpdateFontScale = (fontScale: number): ReduxAction => {
  return {
    type: 'FONT_SCALE_UPDATE',
    payload: {
      fontScale,
    },
  }
}

/**
 * Redux action to update the font scale
 */
export const updateCurrentFontScale = (fontScale: number): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchUpdateFontScale(fontScale))
  }
}
