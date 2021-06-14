import createReducer from './createReducer'

export type DemoState = {
  demoMode: boolean
}

export const initialDemoState: DemoState = {
  demoMode: false,
}

export default createReducer<DemoState>(initialDemoState, {
  UPDATE_DEMO_MODE: (state, { demoMode }) => {
    return {
      ...state,
      demoMode: demoMode,
    }
  },
})
