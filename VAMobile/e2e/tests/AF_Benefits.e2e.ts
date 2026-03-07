/** AF tests for Benefits tab: DisabilityRatings, Claims/Appeals, Letters, BenefitLetters */
import { describeAF } from './AFShared'

const AFNavigationBenefits = [
  ['DisabilityRatings.e2e', 'WG_DisabilityRatings', 'Benefits', 'Disability rating'],
  [
    ['Claims.e2e', 'Appeals.e2e', 'AppealsExpanded.e2e'],
    'WG_ClaimsHistoryScreen',
    'Benefits',
    'Claims',
    'Claims history',
  ],
  ['Claims.e2e', 'WG_ClaimDetailsScreen', 'Benefits', 'Claims', 'Claims history', 'Received December 05, 2021'],
  // [
  // 'Claims.e2e',
  // 'WG_SubmitEvidence',
  // 'Benefits',
  // 'Claims',
  // 'Claims history',
  // 'Received December 05, 2021',
  // 'Submit evidence',
  // ],
  ['Appeals.e2e', 'WG_AppealDetailsScreen', 'Benefits', 'Claims', 'Claims history', 'Received July 17, 2008'],
  [
    'Claims.e2e',
    'WG_ConsolidatedClaimsNote',
    'Benefits',
    'Claims',
    'Claims history',
    'Received December 05, 2021',
    'Find out why we sometimes combine claims',
  ],
  [
    'Claims.e2e',
    'WG_WhatDoIDoIfDisagreement',
    'Benefits',
    'Claims',
    'Claims history',
    'Closed',
    'Received January 01, 2021',
    'Learn what to do if you disagree with our decision',
  ],
  ['Letters.e2e', 'WG_LettersOverview', 'Benefits', 'VA letters and documents'],
  ['Letters.e2e', 'WG_LettersList', 'Benefits', 'VA letters and documents', 'Review letters'],
  [
    'Letters.e2e',
    'WG_BenefitSummaryServiceVerificationLetter',
    'Benefits',
    'VA letters and documents',
    'Review letters',
    'Benefit summary and service verification letter',
  ],
  ['BenefitLetters.e2e', 'WG_ClaimLettersScreen', 'Benefits', 'Claims', 'Claim letters'],
]

describeAF('AF Benefits', AFNavigationBenefits)
