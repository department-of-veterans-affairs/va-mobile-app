import { Asset } from 'react-native-image-picker'
import { ClaimEventData } from 'store/api'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'

export type UploadFileToClaimParamaters = {
  claimID: string
  request: ClaimEventData
  files: Array<Asset> | Array<DocumentPickerResponse>
}

export type ClaimOrAppeal = 'claim' | 'appeal'

export type ClaimsAndAppealsListPayload = {
  data: Array<ClaimsAndAppealsList>
  meta: {
    errors?: Array<ClaimsAndAppealsGetDataMetaError>
    pagination: {
      currentPage: number
      perPage: number
      totalEntries: number
    }
  }
}

export type ClaimsAndAppealsGetDataMetaError = {
  service?: string
  errorDetails?: Array<{
    title?: string
    detail?: string
    code?: string
    source?: string
    status?: string
    key?: string
    severity?: string
    text?: string
  }>
}

export type ClaimsAndAppealsList = {
  id: string
  type: ClaimOrAppeal
  attributes: {
    subtype: string
    completed: boolean
    dateFiled: string
    updatedAt: string
    displayTitle: string
    decisionLetterSent: boolean
  }
}
