import { ActionDef } from './index'

export type UpdateDemoModePayload = {
  demoMode: boolean
}

export interface DemoActions {
  UPDATE_DEMO_MODE: ActionDef<'UPDATE_DEMO_MODE', UpdateDemoModePayload>
}
