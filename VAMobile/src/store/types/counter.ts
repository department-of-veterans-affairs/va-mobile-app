import { AType, ActionBase } from './index'

// COUNTER_UPDATE
export type CounterUpdatePayload = number
export type CounterUpdateAction = ActionBase<'COUNTER_UPDATE', CounterUpdatePayload>

// ALL ACTIONS
export type CounterActions = AType<CounterUpdateAction>
