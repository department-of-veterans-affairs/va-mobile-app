import _ from 'underscore'
import * as api from '../api'
import {context, realStore, renderWithProviders, when} from 'testUtils'
import {
  fileUploadSuccess,
  getClaimsAndAppeals,
  getAppeal,
  getClaim,
  prefetchClaimsAndAppeals,
  submitClaimDecision,
  uploadFileToClaim
} from './claimsAndAppeals'
import { appeal as AppealPayload } from 'screens/ClaimsScreen/appealData'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'
import { ClaimEventData, ClaimsAndAppealsGetDataMeta } from '../api/types'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import { ClaimTypeConstants } from 'screens/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import {initialClaimsAndAppealsState, InitialState, StoreState} from '../reducers';
import {DocumentPickerResponse} from '../../screens/ClaimsScreen/ClaimsStackScreens';
import {contentTypes} from 'store/api/api';
import {act} from 'react-test-renderer';
import NetworkConnectionError from '../../components/CommonErrorComponents/NetworkConnectionError';
import React from 'react';
import {ImagePickerResponse} from 'react-native-image-picker';
import {ErrorCode} from 'react-native-image-picker/src/types';

context('claimsAndAppeals', () => {
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
      base64: '1234'
    }
  ]

  const multiFiles: Array<ImagePickerResponse> = [
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
    }
  ]

  const activeClaimsAndAppealsList: api.ClaimsAndAppealsList = [
    {
      id: '1',
      type: 'appeal',
      attributes: {
        subtype: 'supplementalClaim',
        completed: false,
        dateFiled: '2020-10-22',
        updatedAt: '2020-10-28',
        displayTitle: 'supplemental claim for disability compensation'
      },
    },
    {
      id: '0',
      type: 'claim',
      attributes: {
        subtype: 'Disability',
        completed: false,
        dateFiled: '2020-11-13',
        updatedAt: '2020-11-30',
        displayTitle: 'Disability'
      },
    },
    {
      id: '4',
      type: 'claim',
      attributes: {
        subtype: 'Compensation',
        completed: false,
        dateFiled: '2020-06-11',
        updatedAt: '2020-12-07',
        displayTitle: 'Compensation'
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
        dateFiled: '2020-10-22',
        updatedAt: '2020-10-28',
        displayTitle: 'supplemental claim for disability compensation'
      },
    },
    {
      id: '3',
      type: 'claim',
      attributes: {
        subtype: 'Disability',
        completed: true,
        dateFiled: '2020-11-13',
        updatedAt: '2020-11-30',
        displayTitle: 'Disability'
      },
    },
    {
      id: '5',
      type: 'claim',
      attributes: {
        subtype: 'Compensation',
        completed: true,
        dateFiled: '2020-06-11',
        updatedAt: '2020-12-07',
        displayTitle: 'Disability'
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
          .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'false','page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
          .mockResolvedValue({ data: activeClaimsAndAppealsList, meta: mockPagination})
      when(api.get as jest.Mock)
          .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'true','page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
          .mockResolvedValue({ data: closedClaimsAndAppealsList, meta: mockPagination})
      const store = realStore()
      await store.dispatch(prefetchClaimsAndAppeals())

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_PREFETCH_GET' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_PREFETCH_GET' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaimsAndAppeals).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
      expect(claimsAndAppeals.loadedClaimsAndAppeals).toEqual({ ACTIVE: activeClaimsAndAppealsList,  CLOSED: closedClaimsAndAppealsList})
      expect(claimsAndAppeals.claimsAndAppealsByClaimType).toEqual({ ACTIVE: activeClaimsAndAppealsList,  CLOSED: closedClaimsAndAppealsList})
      expect(claimsAndAppeals.claimsAndAppealsMetaPagination).toEqual({ ACTIVE: mockPagination.pagination,  CLOSED: mockPagination.pagination })
    })

    it('should return error if it fails', async () => {
      const error = new Error('backend error')

      // Force one call to error out
      when(api.get as jest.Mock)
          .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'false','page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
          .mockRejectedValue(error)
      const store = realStore()
      await store.dispatch(prefetchClaimsAndAppeals())

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_PREFETCH_GET' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_PREFETCH_GET' })
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
            CLOSED: closedClaimsAndAppealsList
          },
          claimsAndAppealsMetaPagination: {
            ACTIVE: mockPagination.pagination,
            CLOSED: mockPagination.pagination
          }
        }
      })

      //prefetchClaimsAndAppeals
      await store.dispatch(prefetchClaimsAndAppeals())

      expect(api.get).not.toBeCalled()

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_PREFETCH_GET' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_PREFETCH_GET' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaimsAndAppeals).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
      expect(claimsAndAppeals.loadedClaimsAndAppeals).toEqual({ ACTIVE: activeClaimsAndAppealsList, CLOSED: closedClaimsAndAppealsList})
      expect(claimsAndAppeals.claimsAndAppealsByClaimType).toEqual({ ACTIVE: activeClaimsAndAppealsList,  CLOSED: closedClaimsAndAppealsList})
      expect(claimsAndAppeals.claimsAndAppealsMetaPagination).toEqual({ ACTIVE: mockPagination.pagination, CLOSED: mockPagination.pagination})
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
          .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'false','page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
          .mockResolvedValue({ data: activeClaimsAndAppealsList, meta: mockPagination})
      const store = realStore()
      await store.dispatch(getClaimsAndAppeals(ClaimTypeConstants.ACTIVE))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_GET' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_GET' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaimsAndAppeals).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
      expect(claimsAndAppeals.loadedClaimsAndAppeals).toEqual({ ACTIVE: activeClaimsAndAppealsList,  CLOSED: []})
      expect(claimsAndAppeals.claimsAndAppealsByClaimType).toEqual({ ACTIVE: activeClaimsAndAppealsList,  CLOSED: []})
      expect(claimsAndAppeals.claimsAndAppealsMetaPagination).toEqual({ ACTIVE: mockPagination.pagination,  CLOSED: {
          currentPage: 1,
          totalEntries: 0,
          perPage: 0,
        }})
    })

    it('should return error if it fails', async () => {
      const error = new Error('backend error')

      when(api.get as jest.Mock)
          .calledWith(`/v0/claims-and-appeals-overview`, { showCompleted: 'false','page[size]': DEFAULT_PAGE_SIZE.toString(), 'page[number]': '1' })
          .mockRejectedValue(error)
      const store = realStore()
      await store.dispatch(getClaimsAndAppeals(ClaimTypeConstants.ACTIVE))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_GET' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_GET' })
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
            CLOSED: []
          },
          claimsAndAppealsMetaPagination: {
            ACTIVE: mockPagination.pagination,
            CLOSED: mockPagination.pagination
          }
        }
      })

      //loadedClaimsAndAppeals
      await store.dispatch(getClaimsAndAppeals(ClaimTypeConstants.ACTIVE))

      expect(api.get).not.toBeCalled()

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_GET' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_GET' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaimsAndAppeals).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
      expect(claimsAndAppeals.loadedClaimsAndAppeals).toEqual({ ACTIVE: activeClaimsAndAppealsList, CLOSED: []})
      expect(claimsAndAppeals.claimsAndAppealsByClaimType).toEqual({ ACTIVE: activeClaimsAndAppealsList,  CLOSED: []})
      expect(claimsAndAppeals.claimsAndAppealsMetaPagination).toEqual({ ACTIVE: {
          currentPage: 1,
          perPage: 10,
          totalEntries: 3,
        }, CLOSED: {
          currentPage: 2,
          perPage: 10,
          totalEntries: 3,
        }})
    })
  })

  describe('getClaim', () => {
    it('should dispatch the correct actions', async () => {
      const claimsDetail: api.ClaimData = Claim

      when(api.get as jest.Mock)
          .calledWith('/v0/claim/245182')
          .mockResolvedValue({ data: claimsDetail })

      const store = realStore()
      await store.dispatch(getClaim('245182'))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_GET_ClAIM' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_GET_ClAIM' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaim).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
      expect(claimsAndAppeals.claim).toEqual(claimsDetail) //claimsDetail
    })

    it('should return error if it fails', async () => {
      const error = new Error('backend error')

      when(api.get as jest.Mock)
          .calledWith('/v0/claim/245182')
          .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getClaim('245182'))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_GET_ClAIM' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_GET_ClAIM' })
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
          .calledWith(`/v0/appeal/2765759`)
          .mockResolvedValue({ data: AppealPayload})

      const store = realStore()
      await store.dispatch(getAppeal(id))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_GET_APPEAL' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_GET_APPEAL' })
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
          .calledWith(`/v0/appeal/2765759`)
          .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getAppeal(id))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_GET_APPEAL' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_GET_APPEAL' })
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
        .mockResolvedValue({ data: { jobId: '1' }})

      await store.dispatch(submitClaimDecision('id'))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_SUBMIT_CLAIM_DECISION' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_SUBMIT_CLAIM_DECISION' })
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
        .mockResolvedValue({ data: { jobId: '1' }})

    })

    it('should dispatch the correct actions', async () => {
      const store = realStore()

      await store.dispatch(uploadFileToClaim('id', claimEventData, files))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_FILE_UPLOAD' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_FILE_UPLOAD' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingFileUpload).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
    })

    it('should update the claim event as uploaded', async () => {
      const mockStorePersonalInformation: Partial<StoreState> = {
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
              eventsTimeline: [
                claimEventData
              ],
            }
          }
        }
      }

      const store = realStore(mockStorePersonalInformation)
      await store.dispatch(uploadFileToClaim('id', claimEventData, files))
      const {claimsAndAppeals} = store.getState()

      expect(claimsAndAppeals?.claim?.attributes.eventsTimeline[0].uploaded).toBe(true)
    })

    it('should call the multi image endpoint with more than one image', async () => {
      when(api.post as jest.Mock)
        .calledWith('/v0/claim/id/documents/multi-image', expect.anything())

      const store = realStore()

      await store.dispatch(uploadFileToClaim('id', claimEventData, multiFiles))

      expect((api.post as jest.Mock)).toBeCalledWith('/v0/claim/id/documents/multi-image', {'document_type': 'L228', 'files': ['imgstring', 'imgstring'], 'tracked_item_id': 1})
    })
  })

  describe('fileUploadSuccess', () => {
    it('should dispatch the correct actions', async () => {
      const store = realStore()
      await store.dispatch(fileUploadSuccess())

      const actions = store.getActions()

      const action = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FILE_UPLOAD_SUCCESS' })
      expect(action).toBeTruthy()

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.filesUploadedSuccess).toBeFalsy()
    })
  })
})
