export const ClaimTypeConstants: {
  ACTIVE: ClaimType
  CLOSED: ClaimType
} = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
}

export type ClaimType = 'ACTIVE' | 'CLOSED'

// These are claim type codes for Disability Compensation claims. Claim type codes listed here
// are used in isDisabilityCompensationClaim() to show the 8 claim phase steps instead of 5.
export const DISABILITY_COMPENSATION_CLAIM_TYPE_CODES = [
  '010INITMORE8',
  '010LCMPPIDES',
  '010LCOMP',
  '010LCOMPBDD',
  '010LCOMPD2D',
  '010LCOMPIDES',
  '010NADIDES8',
  '020BDDNO',
  '020CLMINC',
  '020EPDSUPP',
  '020IDESRRNAD',
  '020NADIDESNO',
  '020NEW',
  '020NEWIDES',
  '020NEWPMC',
  '020NHPNH10',
  '020NI',
  '020PNI',
  '020PREDSUPP',
  '020RCOMP',
  '020RI',
  '020RN',
  '020RRNADIDES',
  '020RSCDTH',
  '020RSCDTHPMC',
  '020SD2D',
  '020SMB',
  '020SUPP',
  '110INITLESS8',
  '110LCMP7IDES',
  '110LCOMP7',
  '110LCOMP7BDD',
  '110LCOMPD2D',
  '110LCOMPIDES',
  '110NADIDES7',
]

export const MAX_NUM_PHOTOS = 10
