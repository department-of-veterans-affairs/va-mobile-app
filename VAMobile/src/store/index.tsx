import { ReduxAction } from './types'
import { Store, applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import rootReducer, { StoreState } from './reducers'
import thunk from 'redux-thunk'

export * from './reducers'
export * from './actions'
export * from './types'

const configureStore = (state?: StoreState): Store<StoreState, ReduxAction> => {
  const middleware = applyMiddleware(thunk)

  return createStore(rootReducer, state, middleware) as Store<StoreState, ReduxAction>
}

export default configureStore
