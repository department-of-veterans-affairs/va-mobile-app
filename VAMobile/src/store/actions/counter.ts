import { CounterUpdateAction } from 'store/types'

export const updateCounter = (counter: number): CounterUpdateAction => {
	return {
		type: 'COUNTER_UPDATE',
		payload: counter,
	}
}
