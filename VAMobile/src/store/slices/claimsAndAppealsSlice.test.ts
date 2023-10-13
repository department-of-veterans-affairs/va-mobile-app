import _ from 'underscore'
import * as api from '../api'
import { context, realStore, when } from 'testUtils'
import { appeal as AppealPayload } from 'screens/BenefitsScreen/ClaimsScreen/appealData'
import { claim as Claim } from 'screens/BenefitsScreen/ClaimsScreen/claimData'
import { ClaimEventData, ClaimsAndAppealsGetDataMeta } from 'store/api/types'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { ClaimTypeConstants } from 'screens/BenefitsScreen/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { DocumentPickerResponse } from '../../screens/BenefitsScreen/BenefitsStackScreens'
import { contentTypes } from 'store/api/api'
import { Asset } from 'react-native-image-picker'
import {
  fileUploadSuccess,
  getAppeal,
  getClaim,
  getClaimsAndAppeals,
  initialClaimsAndAppealsState,
  prefetchClaimsAndAppeals,
  submitClaimDecision,
  uploadFileToClaim,
} from './claimsAndAppealsSlice'
import { InitialState } from '.'
import { RootState } from 'store'
import { SnackbarMessages } from 'components/SnackBar'

export const ActionTypes: {
  CLAIMS_AND_APPEALS_START_PREFETCH_GET: string
  CLAIMS_AND_APPEALS_FINISH_PREFETCH_GET: string
  CLAIMS_AND_APPEALS_START_GET: string
  CLAIMS_AND_APPEALS_FINISH_GET: string
  CLAIMS_AND_APPEALS_START_GET_ClAIM: string
  CLAIMS_AND_APPEALS_FINISH_GET_ClAIM: string
  CLAIMS_AND_APPEALS_START_GET_APPEAL: string
  CLAIMS_AND_APPEALS_FINISH_GET_APPEAL: string
  CLAIMS_AND_APPEALS_START_SUBMIT_CLAIM_DECISION: string
  CLAIMS_AND_APPEALS_FINISH_SUBMIT_CLAIM_DECISION: string
  CLAIMS_AND_APPEALS_START_FILE_UPLOAD: string
  CLAIMS_AND_APPEALS_FINISH_FILE_UPLOAD: string
  CLAIMS_AND_APPEALS_FILE_UPLOAD_SUCCESS: string
} = {
  CLAIMS_AND_APPEALS_START_PREFETCH_GET: 'claimsAndAppeals/dispatchStartPrefetchGetClaimsAndAppeals',
  CLAIMS_AND_APPEALS_FINISH_PREFETCH_GET: 'claimsAndAppeals/dispatchFinishPrefetchGetClaimsAndAppeals',
  CLAIMS_AND_APPEALS_START_GET: 'claimsAndAppeals/dispatchStartGetAllClaimsAndAppeals',
  CLAIMS_AND_APPEALS_FINISH_GET: 'claimsAndAppeals/dispatchFinishAllClaimsAndAppeals',
  CLAIMS_AND_APPEALS_START_GET_ClAIM: 'claimsAndAppeals/dispatchStartGetClaim',
  CLAIMS_AND_APPEALS_FINISH_GET_ClAIM: 'claimsAndAppeals/dispatchFinishGetClaim',
  CLAIMS_AND_APPEALS_START_GET_APPEAL: 'claimsAndAppeals/dispatchStartGetAppeal',
  CLAIMS_AND_APPEALS_FINISH_GET_APPEAL: 'claimsAndAppeals/dispatchFinishGetAppeal',
  CLAIMS_AND_APPEALS_START_SUBMIT_CLAIM_DECISION: 'claimsAndAppeals/dispatchStartSubmitClaimDecision',
  CLAIMS_AND_APPEALS_FINISH_SUBMIT_CLAIM_DECISION: 'claimsAndAppeals/dispatchFinishSubmitClaimDecision',
  CLAIMS_AND_APPEALS_START_FILE_UPLOAD: 'claimsAndAppeals/dispatchStartFileUpload',
  CLAIMS_AND_APPEALS_FINISH_FILE_UPLOAD: 'claimsAndAppeals/dispatchFinishFileUpload',
  CLAIMS_AND_APPEALS_FILE_UPLOAD_SUCCESS: 'claimsAndAppeals/dispatchFileUploadSuccess',
}

const snackbarMessages: SnackbarMessages = {
  successMsg: 'success',
  errorMsg: 'failure',
}

context('claimsAndAppeals', () => {

  afterEach(() => {
    jest.clearAllMocks()
  })
  
  const claimEventData: ClaimEventData = {
    description: 'need proof of something',
    type: 'eventType',
    date: 'today',
    documentType: 'L228',
    uploaded: false,
    trackedItemId: 1,
  }

  const files: Array<DocumentPickerResponse> = [
    {
      uri: '/my/stuff',
      fileCopyUri: '/my/stuff',
      type: 'jpeg',
      name: 'myfile',
      size: 100,
      base64: '1234',
    },
  ]

  const multiFiles: Array<Asset> = [
    {
      base64: 'imgstring',
      uri: 'path/to/file',
      fileSize: 100,
      fileName: 'myfile',
    },
    {
      base64: 'imgstring',
      uri: 'path/to/file',
      fileSize: 100,
      fileName: 'myfile',
    },
  ]

  const activeClaimsAndAppealsList: api.ClaimsAndAppealsList = [
    {
      id: '1',
      type: 'appeal',
      attributes: {
        subtype: 'supplementalClaim',
        completed: false,
        decisionLetterSent: false,
        dateFiled: '2020-10-22',
        updatedAt: '2020-10-28',
        displayTitle: 'supplemental claim for disability compensation',
      },
    },
    {
      id: '0',
      type: 'claim',
      attributes: {
        subtype: 'Disability',
        completed: false,
        decisionLetterSent: false,
        dateFiled: '2020-11-13',
        updatedAt: '2020-11-30',
        displayTitle: 'Disability',
      },
    },
    {
      id: '4',
      type: 'claim',
      attributes: {
        subtype: 'Compensation',
        completed: false,
        decisionLetterSent: false,
        dateFiled: '2020-06-11',
        updatedAt: '2020-12-07',
        displayTitle: 'Compensation',
      },
    },
  ]

  const closedClaimsAndAppealsList: api.ClaimsAndAppealsList = [
    {
      id: '2',
      type: 'appeal',
      attributes: {
        subtype: 'supplementalClaim',
        completed: true,
        decisionLetterSent: true,
        dateFiled: '2020-10-22',
        updatedAt: '2020-10-28',
        displayTitle: 'supplemental claim for disability compensation',
      },
    },
    {
      id: '3',
      type: 'claim',
      attributes: {
        subtype: 'Disability',
        completed: true,
        decisionLetterSent: true,
        dateFiled: '2020-11-13',
        updatedAt: '2020-11-30',
        displayTitle: 'Disability',
      },
    },
    {
      id: '5',
      type: 'claim',
      attributes: {
        subtype: 'Compensation',
        completed: true,
        decisionLetterSent: true,
        dateFiled: '2020-06-11',
        updatedAt: '2020-12-07',
        displayTitle: 'Disability',
      },
    },
  ]

  describe('prefetchClaimsAndAppeals', () => {
    const mockPagination: ClaimsAndAppealsGetDataMeta = {
      dataFromStore: false,
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalEntries: 3,
      },
    }

    it('should dispatch the correct actions', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
        .mockResolvedValue({ data: activeClaimsAndAppealsList, meta: mockPagination })
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'true', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
        .mockResolvedValue({ data: closedClaimsAndAppealsList, meta: mockPagination })
      const store = realStore()
      await store.dispatch(prefetchClaimsAndAppeals())

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_START_PREFETCH_GET })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_FINISH_PREFETCH_GET })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaimsAndAppeals).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
      expect(claimsAndAppeals.loadedClaimsAndAppeals).toEqual({ ACTIVE: activeClaimsAndAppealsList, CLOSED: closedClaimsAndAppealsList })
      expect(claimsAndAppeals.claimsAndAppealsByClaimType).toEqual({ ACTIVE: activeClaimsAndAppealsList, CLOSED: closedClaimsAndAppealsList })
      expect(claimsAndAppeals.claimsAndAppealsMetaPagination).toEqual({ ACTIVE: mockPagination.pagination, CLOSED: mockPagination.pagination })
    })

    it('should return error if it fails', async () => {
      const error = new Error('backend error')

      // Force one call to error out
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
        .mockRejectedValue(error)
      const store = realStore()
      await store.dispatch(prefetchClaimsAndAppeals())

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_START_PREFETCH_GET })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_FINISH_PREFETCH_GET })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaimsAndAppeals).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toEqual(error)
    })

    it('should use loadedClaimsAndAppeals data when available', async () => {
      const store = realStore({
        ...InitialState,
        claimsAndAppeals: {
          ...initialClaimsAndAppealsState,
          loadedClaimsAndAppeals: {
            ACTIVE: activeClaimsAndAppealsList,
            CLOSED: closedClaimsAndAppealsList,
          },
          claimsAndAppealsMetaPagination: {
            ACTIVE: mockPagination.pagination,
            CLOSED: mockPagination.pagination,
          },
        },
      })

      //prefetchClaimsAndAppeals
      await store.dispatch(prefetchClaimsAndAppeals())

      expect(api.get).not.toBeCalled()

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_START_PREFETCH_GET })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_FINISH_PREFETCH_GET })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaimsAndAppeals).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
      expect(claimsAndAppeals.loadedClaimsAndAppeals).toEqual({ ACTIVE: activeClaimsAndAppealsList, CLOSED: closedClaimsAndAppealsList })
      expect(claimsAndAppeals.claimsAndAppealsByClaimType).toEqual({ ACTIVE: activeClaimsAndAppealsList, CLOSED: closedClaimsAndAppealsList })
      expect(claimsAndAppeals.claimsAndAppealsMetaPagination).toEqual({ ACTIVE: mockPagination.pagination, CLOSED: mockPagination.pagination })
    })
  })

  describe('getClaimsAndAppeals', () => {
    const mockPagination: ClaimsAndAppealsGetDataMeta = {
      dataFromStore: false,
      pagination: {
        currentPage: 2,
        perPage: 10,
        totalEntries: 3,
      },
    }

    it('should dispatch the correct actions', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
        .mockResolvedValue({ data: activeClaimsAndAppealsList, meta: mockPagination })
      const store = realStore()
      await store.dispatch(getClaimsAndAppeals(ClaimTypeConstants.ACTIVE))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_START_GET })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_FINISH_GET })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaimsAndAppeals).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
      expect(claimsAndAppeals.loadedClaimsAndAppeals).toEqual({ ACTIVE: activeClaimsAndAppealsList, CLOSED: [] })
      expect(claimsAndAppeals.claimsAndAppealsByClaimType).toEqual({ ACTIVE: activeClaimsAndAppealsList, CLOSED: [] })
      expect(claimsAndAppeals.claimsAndAppealsMetaPagination).toEqual({
        ACTIVE: mockPagination.pagination,
        CLOSED: {
          currentPage: 1,
          totalEntries: 0,
          perPage: 0,
        },
      })
    })

    it('should return error if it fails', async () => {
      const error = new Error('backend error')

      when(api.get as jest.Mock)
        .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'false', 'page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
        .mockRejectedValue(error)
      const store = realStore()
      await store.dispatch(getClaimsAndAppeals(ClaimTypeConstants.ACTIVE))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_START_GET })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_FINISH_GET })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaimsAndAppeals).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toEqual(error)
    })

    it('should use loadedClaimsAndAppeals data when available', async () => {
      const store = realStore({
        ...InitialState,
        claimsAndAppeals: {
          ...initialClaimsAndAppealsState,
          loadedClaimsAndAppeals: {
            ACTIVE: activeClaimsAndAppealsList,
            CLOSED: [],
          },
          claimsAndAppealsMetaPagination: {
            ACTIVE: mockPagination.pagination,
            CLOSED: mockPagination.pagination,
          },
        },
      })

      //loadedClaimsAndAppeals
      await store.dispatch(getClaimsAndAppeals(ClaimTypeConstants.ACTIVE))

      expect(api.get).not.toBeCalled()

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_START_GET })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_FINISH_GET })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaimsAndAppeals).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
      expect(claimsAndAppeals.loadedClaimsAndAppeals).toEqual({ ACTIVE: activeClaimsAndAppealsList, CLOSED: [] })
      expect(claimsAndAppeals.claimsAndAppealsByClaimType).toEqual({ ACTIVE: activeClaimsAndAppealsList, CLOSED: [] })
      expect(claimsAndAppeals.claimsAndAppealsMetaPagination).toEqual({
        ACTIVE: {
          currentPage: 1,
          perPage: 10,
          totalEntries: 3,
        },
        CLOSED: {
          currentPage: 2,
          perPage: 10,
          totalEntries: 3,
        },
      })
    })
  })

  describe('getClaim', () => {
    it('should dispatch the correct actions', async () => {
      const claimsDetail: api.ClaimData = Claim

      when(api.get as jest.Mock)
        .calledWith('/v0/claim/245182', {}, expect.anything())
        .mockResolvedValue({ data: claimsDetail })

      const store = realStore()
      await store.dispatch(getClaim('245182'))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_START_GET_ClAIM })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_FINISH_GET_ClAIM })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaim).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
      expect(claimsAndAppeals.claim).toEqual(claimsDetail) //claimsDetail
    })

    it('should return error if it fails', async () => {
      const error = new Error('backend error')

      when(api.get as jest.Mock)
        .calledWith('/v0/claim/245182', {}, expect.anything())
        .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getClaim('245182'))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_START_GET_ClAIM })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_FINISH_GET_ClAIM })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaim).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toEqual(error) //error
    })
  })

  describe('getAppeal', () => {
    it('should dispatch the correct actions', async () => {
      const id = '2765759'
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/2765759`, {}, expect.anything())
        .mockResolvedValue({ data: AppealPayload })

      const store = realStore()
      await store.dispatch(getAppeal(id))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_START_GET_APPEAL })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_FINISH_GET_APPEAL })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingAppeal).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
      expect(claimsAndAppeals.appeal).toEqual(AppealPayload)
    })

    it('should return error if it fails', async () => {
      const error = new Error('Backend error')
      const id = '2765759'
      when(api.get as jest.Mock)
        .calledWith(`/v0/appeal/2765759`, {}, expect.anything())
        .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getAppeal(id))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_START_GET_APPEAL })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_FINISH_GET_APPEAL })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingAppeal).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toEqual(error)
    })
  })

  describe('submitClaimDecision', () => {
    it('should dispatch the correct actions', async () => {
      const store = realStore()
      when(api.post as jest.Mock)
        .calledWith('/v0/claim/id/request-decision')
        .mockResolvedValue({ data: { jobId: '1' } })

      await store.dispatch(submitClaimDecision('id'))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_START_SUBMIT_CLAIM_DECISION })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_FINISH_SUBMIT_CLAIM_DECISION })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingSubmitClaimDecision).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
    })
  })

  describe('uploadFileToClaim', () => {
    beforeEach(() => {
      when(api.post as jest.Mock)
        .calledWith('/v0/claim/id/documents', expect.anything(), contentTypes.multipart)
        .mockResolvedValue({ data: { jobId: '1' } })
    })

    it('should dispatch the correct actions', async () => {
      const store = realStore()

      await store.dispatch(uploadFileToClaim('id', snackbarMessages, claimEventData, files, 'file'))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_START_FILE_UPLOAD })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_FINISH_FILE_UPLOAD })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingFileUpload).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
    })

    it('should update the claim event as uploaded', async () => {
      const mockClaim: Partial<RootState> = {
        claimsAndAppeals: {
          ...initialClaimsAndAppealsState,
          claim: {
            id: 'id',
            type: 'mytype',
            attributes: {
              dateFiled: '',
              minEstDate: null,
              maxEstDate: null,
              phaseChangeDate: null,
              open: true,
              waiverSubmitted: false,
              documentsNeeded: true,
              developmentLetterSent: false,
              decisionLetterSent: false,
              phase: 3,
              everPhaseBack: false,
              currentPhaseBack: false,
              requestedDecision: false,
              claimType: 'type',
              updatedAt: '',
              contentionList: [],
              vaRepresentative: '',
              eventsTimeline: [claimEventData],
            },
          },
        },
      }

      const store = realStore(mockClaim)
      await store.dispatch(uploadFileToClaim('id', snackbarMessages, claimEventData, files, 'file'))
      const { claimsAndAppeals } = store.getState()

      expect(claimsAndAppeals?.claim?.attributes.eventsTimeline[0].uploaded).toBe(true)
    })

    it('should call the multi image endpoint with more than one image', async () => {
      when(api.post as jest.Mock).calledWith('/v0/claim/id/documents/multi-image', expect.anything())

      const store = realStore()

      await store.dispatch(uploadFileToClaim('id', snackbarMessages, claimEventData, multiFiles, 'file'))

      expect(api.post as jest.Mock).toBeCalledWith('/v0/claim/id/documents/multi-image', { document_type: 'L228', files: ['imgstring', 'imgstring'], tracked_item_id: 1 })
    })
  })

  describe('fileUploadSuccess', () => {
    it('should dispatch the correct actions', async () => {
      const store = realStore()
      await store.dispatch(fileUploadSuccess())

      const actions = store.getActions()

      const action = _.find(actions, { type: ActionTypes.CLAIMS_AND_APPEALS_FILE_UPLOAD_SUCCESS })
      expect(action).toBeTruthy()

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.filesUploadedSuccess).toBeFalsy()
    })
  })
})
