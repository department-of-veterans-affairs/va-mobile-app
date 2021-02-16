import { AsyncReduxAction, ReduxAction } from '../types'

const dispatchUpdateFontScale = (fs: number): ReduxAction => {
  return {
    type: 'FONT_SCALE_UPDATE',
    payload: {
      fs,
    },
  }
}

export const updateCurrentFontScale = (fs: number): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchUpdateFontScale(fs))
  }
}
