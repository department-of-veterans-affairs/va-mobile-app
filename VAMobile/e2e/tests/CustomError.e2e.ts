import { setTimeout } from 'timers/promises'

import { APIError } from 'store/api'

import { changeMockData, loginToDemoMode, openAppointments, openHealth } from './utils'

const error: APIError = {
  status: 418,
  endpoint: '/v0/appointments',
  text: '{"errors":[{"title":"Custom error title","body":"Custom error body. \\\\n This explains to the user the details of the ongoing issue.","status":418,"source":"VAOS","telephone":"999-999-9999","refreshable":true}]}',
  json: {
    errors: [
      {
        title: 'Custom error title',
        body: 'Custom error body. \\n This explains to the user the details of the ongoing issue.',
        source: 'VAOS',
        telephone: '999-999-9999',
        refreshable: true,
        detail: '',
        code: '418',
      },
    ],
  },
}
beforeAll(async () => {
  await loginToDemoMode()
})

describe('Custom Error Screen', () => {
  it('should show screen with custom error message if error status is 418', async () => {
    await changeMockData('appointments.json', ['/v0/appointments'], error)
    //await changeMockData('appointments.json', ['/v0/appointments', 'past', 'data'], [])
    // await changeMockData('appointments.json', ['/v0/appointments', 'upcoming', 'data'], [])
    // await changeMockData('appointments.json', ['/v0/appointments'], {
    //   errors: [
    //     {
    //       title: 'Custom error title',
    //       body: 'Custom error body.\\n This explains to the user the details of the ongoing issue.',
    //       status: 418,
    //       source: 'VAOS',
    //       telephone: '999-999-9999',
    //       refreshable: true,
    //     },
    //   ],
    // })
    // await loginToDemoMode()
    await openHealth()
    await openAppointments()
    await setTimeout(5000)
  })
})
