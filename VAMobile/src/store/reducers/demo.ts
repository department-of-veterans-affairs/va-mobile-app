import createReducer from './createReducer'

export type DemoState = {
  demoMode: boolean
}

export const initialDemoState: DemoState = {
  demoMode: false,
}

export default createReducer<DemoState>(initialDemoState, {
  /** reducer that turns demo state on or off */
  UPDATE_DEMO_MODE: (state, { demoMode }) => {
    return {
      ...state,
      demoMode: demoMode,
    }
  },
})
