import { AppealData } from 'store/api/types'

export const appeal: AppealData = {
  id: '0',
  type: 'appeal',
  attributes: {
    appealsIds: ['id'],
    active: true,
    alerts: [
      {
        type: 'form9_needed',
        details: {},
      },
    ],
    aod: true,
    aoj: 'vba',
    description: 'description',
    docket: {
      month: 'January',
      docketMonth: 'string',
      front: true,
      total: 0,
      ahead: 0,
      ready: 0,
      eta: 'February',
    },
    events: [
      {
        data: '2008-04-24',
        type: 'claim_decision',
      },
    ],
    evidence: [
      {
        description: 'description',
        data: 'data',
      },
    ],
    incompleteHistory: true,
    issues: [
      {
        active: true,
        description: 'description',
        diagnosticCode: '8100',
        lastAction: 'field_grant',
        date: '2016-05-03',
      },
    ],
    location: 'aoj',
    programArea: 'compensation',
    status: {
      details: {},
      type: 'scheduled_hearing',
    },
    type: 'disability compensation',
    updated: '2018-01-19T10:20:42-05:00',
  },
}
