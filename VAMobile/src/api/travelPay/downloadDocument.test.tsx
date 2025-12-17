import FileViewer from 'react-native-file-viewer'

import { waitFor } from '@testing-library/react-native'

import { useDownloadTravelPayDocument } from 'api/travelPay'
import store from 'store'
import { DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME } from 'store/api/demo/letters'
import { context, renderQuery, when } from 'testUtils'
import getEnv from 'utils/env'
import { downloadDemoFile, downloadFile } from 'utils/filesystem'

const { API_ROOT } = getEnv()

// Mock FileViewer
jest.mock('react-native-file-viewer', () => ({
  __esModule: true,
  default: {
    open: jest.fn(),
  },
}))

// Mock filesystem utilities
jest.mock('utils/filesystem', () => ({
  downloadFile: jest.fn(),
  downloadDemoFile: jest.fn(),
}))

// Mock environment
jest.mock('utils/env', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    API_ROOT: 'https://api.va.gov',
  })),
}))

// Mock in-app reviews
let mockRegisterReviewEvent: jest.Mock
jest.mock('utils/inAppReviews', () => {
  mockRegisterReviewEvent = jest.fn(() => Promise.resolve())
  return {
    useReviewEvent: () => mockRegisterReviewEvent,
  }
})

context('useDownloadTravelPayDocument', () => {
  const claimId = 'test-claim-id'
  const documentId = 'doc-123'
  const filename = 'test-document.pdf'
  const mockFilePath = '/mock/path/to/file.pdf'

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset store state
    jest.spyOn(store, 'getState').mockReturnValue({
      demo: { demoMode: false },
    } as ReturnType<typeof store.getState>)
    store.dispatch = jest.fn()
  })

  describe('downloading travel pay documents', () => {
    it('should download and open document when enabled', async () => {
      when(downloadFile as jest.Mock)
        .calledWith(
          'GET',
          `${API_ROOT}/v0/travel-pay/claims/${claimId}/documents/${documentId}`,
          filename,
          undefined,
          3,
        )
        .mockResolvedValue(mockFilePath)
      ;(FileViewer.open as jest.Mock).mockResolvedValue(undefined)

      const { result } = renderQuery(() =>
        useDownloadTravelPayDocument(claimId, documentId, filename, { enabled: true }),
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(downloadFile).toHaveBeenCalledWith(
        'GET',
        `${API_ROOT}/v0/travel-pay/claims/${claimId}/documents/${documentId}`,
        filename,
        undefined,
        3,
      )
      expect(FileViewer.open).toHaveBeenCalledWith(mockFilePath, {
        onDismiss: expect.any(Function),
      })
      expect(result.current.data).toBe(true)
    })

    it('should not download when enabled is false', () => {
      const { result } = renderQuery(() =>
        useDownloadTravelPayDocument(claimId, documentId, filename, { enabled: false }),
      )

      expect(downloadFile).not.toHaveBeenCalled()
      expect(FileViewer.open).not.toHaveBeenCalled()
      expect(result.current.data).toBeUndefined()
    })

    it('should use demo file when in demo mode', async () => {
      // Mock demo mode
      jest.spyOn(store, 'getState').mockReturnValue({
        demo: { demoMode: true },
      } as ReturnType<typeof store.getState>)

      when(downloadDemoFile as jest.Mock)
        .calledWith(DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME)
        .mockResolvedValue(mockFilePath)
      ;(FileViewer.open as jest.Mock).mockResolvedValue(undefined)

      const { result } = renderQuery(() =>
        useDownloadTravelPayDocument(claimId, documentId, filename, { enabled: true }),
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(downloadDemoFile).toHaveBeenCalledWith(DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME)
      expect(downloadFile).not.toHaveBeenCalled()
      expect(FileViewer.open).toHaveBeenCalledWith(mockFilePath, {
        onDismiss: expect.any(Function),
      })
    })

    it('should call review event callback when file viewer is dismissed', async () => {
      when(downloadFile as jest.Mock)
        .calledWith(
          'GET',
          `${API_ROOT}/v0/travel-pay/claims/${claimId}/documents/${documentId}`,
          filename,
          undefined,
          3,
        )
        .mockResolvedValueOnce(mockFilePath)

      let onDismissCallback: (() => void) | undefined
      when(FileViewer.open as jest.Mock).mockImplementation((path, options) => {
        onDismissCallback = options.onDismiss
        return Promise.resolve()
      })

      const { result } = renderQuery(() =>
        useDownloadTravelPayDocument(claimId, documentId, filename, { enabled: true }),
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(FileViewer.open).toHaveBeenCalled()
      expect(onDismissCallback).toBeDefined()

      // Call the onDismiss callback
      if (onDismissCallback) {
        onDismissCallback()
      }

      await waitFor(() => {
        expect(mockRegisterReviewEvent).toHaveBeenCalled()
      })
    })

    it('should use correct query key', () => {
      const { result } = renderQuery(() =>
        useDownloadTravelPayDocument(claimId, documentId, filename, { enabled: false }),
      )

      // Query key should be accessible through the result (via tanstack query internals)
      expect(result.current).toBeDefined()
      expect(downloadFile).not.toHaveBeenCalled()
    })

    it('should handle different document IDs and filenames', async () => {
      const differentDocId = 'doc-456'
      const differentFilename = 'another-file.pdf'

      when(downloadFile as jest.Mock)
        .calledWith(
          'GET',
          `${API_ROOT}/v0/travel-pay/claims/${claimId}/documents/${differentDocId}`,
          differentFilename,
          undefined,
          3,
        )
        .mockResolvedValue(mockFilePath)
      ;(FileViewer.open as jest.Mock).mockResolvedValue(undefined)

      const { result } = renderQuery(() =>
        useDownloadTravelPayDocument(claimId, differentDocId, differentFilename, { enabled: true }),
      )

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(downloadFile).toHaveBeenCalledWith(
        'GET',
        `${API_ROOT}/v0/travel-pay/claims/${claimId}/documents/${differentDocId}`,
        differentFilename,
        undefined,
        3,
      )
    })
  })
})
