import { AnyAction, Store, applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import rootReducer, { StoreState } from './reducers'
import thunk from 'redux-thunk'

export * from './reducers'
export * from './actions'
export * from './types'

const configureStore = (state?: StoreState): Store<StoreState, AnyAction> => {
  const middleware = applyMiddleware(thunk, logger)
  //@ts-ignore
  return createStore(rootReducer, state, middleware) as Store<StoreState, AnyAction>
}

export default configureStore
