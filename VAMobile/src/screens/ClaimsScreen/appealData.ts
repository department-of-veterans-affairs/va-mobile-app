import { AppealData } from 'store/api/types'

export const appeal: AppealData = {
  id: '0',
  type: 'higherLevelReview',
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
      ahead: 3479,
      ready: 0,
      eta: 'February',
      type: 'evidenceSubmission',
    },
    events: [
      {
        date: '2015-04-24',
        type: 'claim_decision',
      },
      {
        date: '2010-07-25',
        type: 'hlr_request',
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
        description: 'Service connection, Post-traumatic stress disorder',
        diagnosticCode: null,
        lastAction: null,
        date: '2016-05-03',
      },
      {
        active: true,
        description: 'Eligibility for loan guaranty benefits',
        diagnosticCode: null,
        lastAction: null,
        date: '2016-05-03',
      },
      {
        active: true,
        description: 'Service connected',
        diagnosticCode: null,
        lastAction: null,
        date: '2016-05-03',
      },
      {
        active: true,
        description: 'Other',
        diagnosticCode: null,
        lastAction: null,
        date: '2016-05-03',
      },
      {
        active: true,
        description: 'Validity of debt owed',
        diagnosticCode: null,
        lastAction: null,
        date: '2016-05-03',
      },
      {
        active: true,
        description: 'Effective date, pension benefits',
        diagnosticCode: null,
        lastAction: null,
        date: '2016-05-03',
      },
      {
        active: true,
        description: 'Rule 608 motion to withdraw',
        diagnosticCode: null,
        lastAction: null,
        date: '2016-05-03',
      },
      {
        active: true,
        description: 'Eligibility for pension, unemployability',
        diagnosticCode: null,
        lastAction: null,
        date: '2016-05-03',
      },
    ],
    location: 'aoj',
    programArea: 'compensation',
    status: {
      details: {
        type: 'travel_board',
        lastSocDate: '2020-11-15',
        bvaDecisionDate: '2019-09-15',
        aojDecisionDate: '2020-05-10',
        date: '2020-11-15',
        location: 'San Diego',
        vsoName: 'VBA',
        issues: [
          {
            description: 'desc',
            disposition: 'allowed',
          },
          {
            description: 'desc2',
            disposition: 'allowed',
          },
        ],
      },
      type: 'hlr_received',
    },
    type: 'disability',
    updated: '2018-01-19T10:20:42-05:00',
  },
}
