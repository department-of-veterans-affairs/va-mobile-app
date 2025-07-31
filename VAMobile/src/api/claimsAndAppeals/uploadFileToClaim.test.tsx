import { Asset } from 'react-native-image-picker'

import { waitFor } from '@testing-library/react-native'

import { claimsAndAppealsKeys } from 'api/claimsAndAppeals/queryKeys'
import { useUploadFileToClaim } from 'api/claimsAndAppeals/uploadFileToClaim'
import { ClaimData, ClaimEventData, FILE_REQUEST_STATUS } from 'api/types'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { contentTypes, post } from 'store/api'
import { context, renderMutation, when } from 'testUtils'

let mockLogNonFatalErrorToFirebase: jest.Mock
jest.mock('utils/analytics', () => {
  mockLogNonFatalErrorToFirebase = jest.fn()
  const original = jest.requireActual('utils/analytics')
  return {
    ...original,
    logNonFatalErrorToFirebase: mockLogNonFatalErrorToFirebase,
  }
})

jest.mock('store/api', () => {
  const original = jest.requireActual('store/api')
  return {
    ...original,
    post: jest.fn(),
  }
})

context('uploadFileToClaim', () => {
  describe('on error', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should log error on failure', async () => {
      when(post as jest.Mock)
        .calledWith('/v0/claim/claim-id/documents', expect.anything(), contentTypes.multipart)
        .mockRejectedValueOnce({
          status: 400,
          networkError: true,
        })

      const { mutate, result } = renderMutation(() => useUploadFileToClaim('claim-id', undefined, []))
      await mutate({
        files: [{}],
        claimID: 'claim-id',
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
      expect(mockLogNonFatalErrorToFirebase).toHaveBeenCalledWith(
        {
          networkError: true,
          status: 400,
        },
        'uploadFileToClaim: Service error',
      )
    })

    it('should not log error if rejection is not an error object', async () => {
      when(post as jest.Mock)
        .calledWith('/v0/claim/claim-id/documents', expect.anything(), contentTypes.multipart)
        .mockRejectedValueOnce({
          status: 400,
        })

      const { mutate, result } = renderMutation(() => useUploadFileToClaim('claim-id', undefined, []))
      await mutate({
        files: [{}],
        claimID: 'claim-id',
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })
      expect(mockLogNonFatalErrorToFirebase).not.toHaveBeenCalled()
    })
  })
  describe('on success', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    const initializeTest = async (
      request: ClaimEventData | undefined,
      newRequest: ClaimEventData | undefined,
      eventsTimeline: Array<ClaimEventData> = [],
      newFiles: Array<Asset> | Array<DocumentPickerResponse> = [],
      files: Array<Asset> | Array<DocumentPickerResponse> = [],
    ) => {
      when(post as jest.Mock)
        .calledWith('/v0/claim/claim-id/documents', expect.anything())
        .mockResolvedValueOnce('success')

      const { mutate, result, queryClient } = renderMutation(() => useUploadFileToClaim('claim-id', request, files))
      queryClient.setQueryData([claimsAndAppealsKeys.claim, 'claim-id'], {
        id: 'claim-id',
        type: 'type',
        attributes: {
          eventsTimeline,
        },
      })

      await mutate({
        claimID: 'claim-id',
        documentType: 'document-type',
        request: newRequest,
        files: newFiles,
      })

      return { result, queryClient }
    }

    it('should upload file for review', async () => {
      const files = [
        {
          base64: '',
        },
      ]
      const { result, queryClient } = await initializeTest(undefined, undefined, undefined, files)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(post).toHaveBeenCalledWith('/v0/claim/claim-id/documents', expect.anything(), contentTypes.multipart)

      const claimData = queryClient.getQueryData([claimsAndAppealsKeys.claim, 'claim-id']) as ClaimData
      expect(claimData.attributes.eventsTimeline).toHaveLength(1)
      expect(claimData.attributes.eventsTimeline[0].status).toEqual(FILE_REQUEST_STATUS.SUBMITTED_AWAITING_REVIEW)
    })

    it('should upload asset file for review', async () => {
      const request = {
        type: 'type',
        description: 'description',
        date: Date.now().toString(),
        trackedItemId: 1,
        documentType: '',
      }
      const eventTimeline = [
        {
          description: 'description',
          type: '',
          date: null,
        },
      ]
      const files = [
        {
          fileSize: 1,
          fileName: 'fileName',
          type: 'type',
          uri: '',
          base64: '',
        },
      ]
      const { queryClient, result } = await initializeTest(request, request, eventTimeline, files, files)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(post).toHaveBeenCalledWith('/v0/claim/claim-id/documents', expect.anything(), contentTypes.multipart)

      const claimData = queryClient.getQueryData([claimsAndAppealsKeys.claim, 'claim-id']) as ClaimData
      expect(claimData.attributes.eventsTimeline).toHaveLength(1)
      expect(claimData.attributes.eventsTimeline[0].status).toEqual(FILE_REQUEST_STATUS.SUBMITTED_AWAITING_REVIEW)
    })

    it('should upload document file for review', async () => {
      const request = {
        type: 'type',
        trackedItemId: 1,
        documentType: '',
        date: Date.now().toString(),
      }
      const files = [
        {
          size: 1,
          name: 'fileName',
          type: 'type',
          uri: '',
          base64: '',
        },
      ]

      const { result, queryClient } = await initializeTest(undefined, request, [], files, files)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(post).toHaveBeenCalledWith('/v0/claim/claim-id/documents', expect.anything(), contentTypes.multipart)

      const claimData = queryClient.getQueryData([claimsAndAppealsKeys.claim, 'claim-id']) as ClaimData
      expect(claimData.attributes.eventsTimeline).toHaveLength(1)
      expect(claimData.attributes.eventsTimeline[0].status).toEqual(FILE_REQUEST_STATUS.SUBMITTED_AWAITING_REVIEW)
    })

    it('should upload multiple files for review', async () => {
      const request = {
        type: 'type',
        trackedItemId: 1,
        documentType: '',
        date: Date.now().toString(),
      }
      const files: Array<DocumentPickerResponse> = [
        {
          size: 1,
          name: 'fileName',
          type: 'type',
          uri: '',
          base64: '',
          fileCopyUri: '',
        },
        {
          size: 1,
          name: 'fileName 2',
          type: 'type',
          uri: '',
          base64: '',
          fileCopyUri: '',
        },
      ]

      const { result, queryClient } = await initializeTest(undefined, request, [], files)

      await waitFor(() => expect(result.current.isSuccess).toBe(true))

      expect(post).toHaveBeenCalledWith('/v0/claim/claim-id/documents/multi-image', expect.anything())

      const claimData = queryClient.getQueryData([claimsAndAppealsKeys.claim, 'claim-id']) as ClaimData
      expect(claimData.attributes.eventsTimeline).toHaveLength(1)
      expect(claimData.attributes.eventsTimeline[0].status).toEqual(FILE_REQUEST_STATUS.SUBMITTED_AWAITING_REVIEW)
    })
  })
})
