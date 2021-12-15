import { AsyncReduxAction, ReduxAction } from '../types'

const dispatchUpdatBottomOffset = (bottomOffset: number): ReduxAction => {
  return {
    type: 'BOTTOM_OFFSET_UPDATE',
    payload: {
      bottomOffset,
    },
  }
}

/**
 * Redux action to update bottom offset
 */
export const updatBottomOffset = (bottomOffset: number): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchUpdatBottomOffset(bottomOffset))
  }
}
