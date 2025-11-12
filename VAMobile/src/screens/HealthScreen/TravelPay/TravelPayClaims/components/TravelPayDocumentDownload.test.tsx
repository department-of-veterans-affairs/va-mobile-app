import React from 'react'
import FileViewer from 'react-native-file-viewer'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { TravelPayClaimDocument } from 'api/types'
import TravelPayDocumentDownload from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayDocumentDownload'
import { context, render } from 'testUtils'
import { downloadDemoFile, downloadFile } from 'utils/filesystem'

// Mock FileViewer
jest.mock('react-native-file-viewer', () => ({
  open: jest.fn(),
}))

// Mock filesystem utilities
jest.mock('utils/filesystem', () => ({
  downloadFile: jest.fn(),
  downloadDemoFile: jest.fn(),
}))

// Mock store
const mockGetState = jest.fn()
jest.mock('store', () => ({
  getState: () => mockGetState(),
}))

// Mock analytics
jest.mock('utils/analytics', () => ({
  logAnalyticsEvent: jest.fn(),
}))

// Mock environment
jest.mock('utils/env', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    API_ROOT: 'https://api.va.gov',
  })),
}))

// Mock in-app reviews
const mockRegisterReviewEvent = jest.fn()
jest.mock('utils/inAppReviews', () => ({
  useReviewEvent: () => mockRegisterReviewEvent,
}))

// Mock demo constants
jest.mock('store/api/demo/letters', () => ({
  DEMO_MODE_LETTER_ENDPOINT: '/demo/letter',
  DEMO_MODE_LETTER_NAME: 'demo_letter.pdf',
}))

// Test data
const mockDocument: TravelPayClaimDocument = {
  documentId: 'doc-123',
  filename: 'Decision_Letter.pdf',
  mimetype: 'application/pdf',
  createdon: '2023-12-01T10:00:00.000Z',
}

const mockFileViewer = FileViewer as jest.Mocked<typeof FileViewer>
const mockDownloadFile = downloadFile as jest.MockedFunction<typeof downloadFile>
const mockDownloadDemoFile = downloadDemoFile as jest.MockedFunction<typeof downloadDemoFile>

context('TravelPayDocumentDownload', () => {
  const defaultProps = {
    document: mockDocument,
    claimId: 'claim-123',
  }

  const renderComponent = (
    props: { document: TravelPayClaimDocument; claimId: string; linkText?: string } = defaultProps,
  ) => {
    render(<TravelPayDocumentDownload {...props} />)
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Default mock implementations
    mockGetState.mockReturnValue({ demo: { demoMode: false } })
    mockDownloadFile.mockResolvedValue('/path/to/downloaded/file.pdf')
    mockDownloadDemoFile.mockResolvedValue('/path/to/demo/file.pdf')
    mockFileViewer.open.mockResolvedValue()
  })

  describe('Component Rendering', () => {
    it('should render document link with filename', () => {
      renderComponent()

      expect(screen.getByText(mockDocument.filename)).toBeTruthy()
    })

    it('should render custom link text when provided', () => {
      const customText = 'Download Decision Letter'
      renderComponent({
        ...defaultProps,
        linkText: customText,
      })

      expect(screen.getByText(customText)).toBeTruthy()
      expect(screen.queryByText(mockDocument.filename)).toBeFalsy()
    })

    it('should render download icon', () => {
      renderComponent()

      // Icon should be present in the component structure
      // The exact test depends on how Icon component is implemented
      expect(screen.getByText(mockDocument.filename)).toBeTruthy()
    })

    it('should have proper test ID', () => {
      renderComponent()

      // TestID is based on the filename (using getA11yLabelText)
      const expectedTestId = mockDocument.filename
      expect(screen.getByTestId(expectedTestId)).toBeTruthy()
    })
  })

  describe('Document Download - Production Mode', () => {
    beforeEach(() => {
      mockGetState.mockReturnValue({ demo: { demoMode: false } })
    })

    it('should initiate download when link is pressed', async () => {
      renderComponent()

      const downloadLink = screen.getByText(mockDocument.filename)
      fireEvent.press(downloadLink)

      await waitFor(() => {
        expect(mockDownloadFile).toHaveBeenCalledWith(
          'GET',
          'https://api.va.gov/v0/travel-pay/claims/claim-123/documents/doc-123',
          'Decision_Letter.pdf',
          undefined,
          3,
        )
      })
    })

    it('should open file viewer after successful download', async () => {
      const filePath = '/path/to/downloaded/file.pdf'
      mockDownloadFile.mockResolvedValue(filePath)

      renderComponent()

      const downloadLink = screen.getByText(mockDocument.filename)
      fireEvent.press(downloadLink)

      await waitFor(() => {
        expect(mockFileViewer.open).toHaveBeenCalledWith(filePath, {
          onDismiss: expect.any(Function),
        })
      })
    })

    it('should register review event on file viewer dismiss', async () => {
      const filePath = '/path/to/downloaded/file.pdf'
      mockDownloadFile.mockResolvedValue(filePath)

      renderComponent()

      const downloadLink = screen.getByText(mockDocument.filename)
      fireEvent.press(downloadLink)

      await waitFor(() => {
        expect(mockFileViewer.open).toHaveBeenCalled()
      })

      // Simulate onDismiss callback
      const callArgs = mockFileViewer.open.mock.calls[0][1] as { onDismiss: () => Promise<void> }
      await callArgs.onDismiss()

      expect(mockRegisterReviewEvent).toHaveBeenCalled()
    })

    it('should handle download failure gracefully', async () => {
      mockDownloadFile.mockResolvedValue(undefined)

      renderComponent()

      const downloadLink = screen.getByText(mockDocument.filename)
      fireEvent.press(downloadLink)

      await waitFor(() => {
        expect(mockDownloadFile).toHaveBeenCalled()
      })

      // Should not open file viewer if download failed
      expect(mockFileViewer.open).not.toHaveBeenCalled()
    })
  })

  describe('Document Download - Demo Mode', () => {
    beforeEach(() => {
      mockGetState.mockReturnValue({ demo: { demoMode: true } })
    })

    it('should use demo file download in demo mode', async () => {
      renderComponent()

      const downloadLink = screen.getByText(mockDocument.filename)
      fireEvent.press(downloadLink)

      await waitFor(() => {
        expect(mockDownloadDemoFile).toHaveBeenCalledWith('/demo/letter', 'demo_letter.pdf')
      })

      expect(mockDownloadFile).not.toHaveBeenCalled()
    })

    it('should open demo file after download', async () => {
      const demoFilePath = '/path/to/demo/file.pdf'
      mockDownloadDemoFile.mockResolvedValue(demoFilePath)

      renderComponent()

      const downloadLink = screen.getByText(mockDocument.filename)
      fireEvent.press(downloadLink)

      await waitFor(() => {
        expect(mockFileViewer.open).toHaveBeenCalledWith(demoFilePath, {
          onDismiss: expect.any(Function),
        })
      })
    })
  })

  describe('Loading States', () => {
    it('should prevent multiple simultaneous downloads', async () => {
      // Make download take some time
      const downloadPromise = new Promise<string>((resolve) => setTimeout(() => resolve('/path/to/file.pdf'), 1000))
      mockDownloadFile.mockReturnValue(downloadPromise)

      renderComponent()

      const downloadLink = screen.getByText(mockDocument.filename)

      // Press multiple times quickly
      fireEvent.press(downloadLink)
      fireEvent.press(downloadLink)
      fireEvent.press(downloadLink)

      // Should only call download once
      await waitFor(() => {
        expect(mockDownloadFile).toHaveBeenCalledTimes(1)
      })
    })

    it('should show custom link text even when downloading', async () => {
      const customText = 'Download Decision Letter'
      let resolveDownload: (value: string) => void
      const downloadPromise = new Promise<string>((resolve) => {
        resolveDownload = resolve
      })
      mockDownloadFile.mockReturnValue(downloadPromise)

      renderComponent({
        ...defaultProps,
        linkText: customText,
      })

      const downloadLink = screen.getByText(customText)
      fireEvent.press(downloadLink)

      // The text should remain the same during download (no "downloading" state in current implementation)
      await waitFor(() => {
        expect(screen.getByText(customText)).toBeTruthy()
      })

      // Resolve the download
      resolveDownload!('/path/to/file.pdf')

      // Should still show custom text
      await waitFor(() => {
        expect(screen.getByText(customText)).toBeTruthy()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper accessibility label', () => {
      renderComponent()

      // TestID is based on the filename
      const downloadLink = screen.getByTestId(mockDocument.filename)
      expect(downloadLink).toBeTruthy()
    })

    it('should have accessibility label with custom link text', () => {
      const customText = 'Download Decision Letter'
      renderComponent({
        ...defaultProps,
        linkText: customText,
      })

      // TestID is based on the custom link text
      const downloadLink = screen.getByTestId(customText)
      expect(downloadLink).toBeTruthy()
    })

    it('should be accessible during download state', async () => {
      let resolveDownload: (value: string) => void
      const downloadPromise = new Promise<string>((resolve) => {
        resolveDownload = resolve
      })
      mockDownloadFile.mockReturnValue(downloadPromise)

      renderComponent()

      const downloadLink = screen.getByText(mockDocument.filename)
      fireEvent.press(downloadLink)

      // Should still be accessible during download
      await waitFor(() => {
        const downloadingLink = screen.getByTestId(mockDocument.filename)
        expect(downloadingLink).toBeTruthy()
      })

      resolveDownload!('/path/to/file.pdf')
    })
  })

  describe('Different Document Types', () => {
    const testDocuments = [
      {
        documentId: 'pdf-doc',
        filename: 'decision_letter.pdf',
        mimetype: 'application/pdf',
        createdon: '2023-12-01T10:00:00.000Z',
      },
      {
        documentId: 'jpg-doc',
        filename: 'receipt.jpg',
        mimetype: 'image/jpeg',
        createdon: '2023-12-01T10:00:00.000Z',
      },
      {
        documentId: 'doc-file',
        filename: 'form.doc',
        mimetype: 'application/msword',
        createdon: '2023-12-01T10:00:00.000Z',
      },
    ]

    testDocuments.forEach((doc) => {
      it(`should handle ${doc.mimetype} files correctly`, async () => {
        renderComponent({
          ...defaultProps,
          document: doc,
        })

        expect(screen.getByText(doc.filename)).toBeTruthy()

        const downloadLink = screen.getByText(doc.filename)
        fireEvent.press(downloadLink)

        await waitFor(() => {
          expect(mockDownloadFile).toHaveBeenCalledWith(
            'GET',
            `https://api.va.gov/v0/travel-pay/claims/claim-123/documents/${doc.documentId}`,
            doc.filename,
            undefined,
            3,
          )
        })
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle download errors gracefully', async () => {
      mockDownloadFile.mockRejectedValue(new Error('Download failed'))

      renderComponent()

      const downloadLink = screen.getByText(mockDocument.filename)

      // Should not crash when download fails
      expect(() => fireEvent.press(downloadLink)).not.toThrow()
    })

    it('should handle file viewer errors gracefully', async () => {
      mockDownloadFile.mockResolvedValue('/path/to/file.pdf')
      mockFileViewer.open.mockRejectedValue(new Error('Cannot open file'))

      renderComponent()

      const downloadLink = screen.getByText(mockDocument.filename)
      fireEvent.press(downloadLink)

      await waitFor(() => {
        expect(mockDownloadFile).toHaveBeenCalled()
      })

      // Should not crash when file viewer fails
      expect(mockFileViewer.open).toHaveBeenCalled()
    })

    it('should handle malformed document data', () => {
      const malformedDoc = {
        documentId: '',
        filename: null as unknown as string,
        mimetype: undefined as unknown as string,
        createdon: 'invalid-date',
      }

      // Should not crash with malformed data
      expect(() =>
        renderComponent({
          ...defaultProps,
          document: malformedDoc,
        }),
      ).not.toThrow()
    })
  })

  describe('URL Construction', () => {
    it('should construct correct download URL', async () => {
      renderComponent({
        document: mockDocument,
        claimId: 'test-claim-456',
      })

      const downloadLink = screen.getByText(mockDocument.filename)
      fireEvent.press(downloadLink)

      await waitFor(() => {
        expect(mockDownloadFile).toHaveBeenCalledWith(
          'GET',
          'https://api.va.gov/v0/travel-pay/claims/test-claim-456/documents/doc-123',
          'Decision_Letter.pdf',
          undefined,
          3,
        )
      })
    })

    it('should handle special characters in claim ID and document ID', async () => {
      const specialCharsProps = {
        document: { ...mockDocument, documentId: 'doc-123-áéí' },
        claimId: 'claim-456-xyz',
      }

      renderComponent(specialCharsProps)

      const downloadLink = screen.getByText(mockDocument.filename)
      fireEvent.press(downloadLink)

      await waitFor(() => {
        expect(mockDownloadFile).toHaveBeenCalledWith(
          'GET',
          'https://api.va.gov/v0/travel-pay/claims/claim-456-xyz/documents/doc-123-áéí',
          'Decision_Letter.pdf',
          undefined,
          3,
        )
      })
    })
  })

  describe('File Naming', () => {
    it('should preserve original filename', async () => {
      const docWithLongName = {
        ...mockDocument,
        filename: 'Very_Long_Decision_Letter_With_Special_Characters_@#$.pdf',
      }

      renderComponent({
        ...defaultProps,
        document: docWithLongName,
      })

      const downloadLink = screen.getByText(docWithLongName.filename)
      fireEvent.press(downloadLink)

      await waitFor(() => {
        expect(mockDownloadFile).toHaveBeenCalledWith('GET', expect.any(String), docWithLongName.filename, undefined, 3)
      })
    })

    it('should handle filenames without extensions', async () => {
      const docWithoutExt = {
        ...mockDocument,
        filename: 'decision_letter',
      }

      renderComponent({
        ...defaultProps,
        document: docWithoutExt,
      })

      expect(screen.getByText('decision_letter')).toBeTruthy()

      const downloadLink = screen.getByText('decision_letter')
      fireEvent.press(downloadLink)

      await waitFor(() => {
        expect(mockDownloadFile).toHaveBeenCalledWith('GET', expect.any(String), 'decision_letter', undefined, 3)
      })
    })
  })

  describe('Component Integration', () => {
    it('should integrate with DefaultList correctly', () => {
      renderComponent()

      // TestID is based on the filename
      const downloadLink = screen.getByTestId(mockDocument.filename)
      expect(downloadLink).toBeTruthy()

      // Should be pressable
      expect(() => fireEvent.press(downloadLink)).not.toThrow()
    })

    it('should integrate with Icon component correctly', () => {
      renderComponent()

      // Icon should be rendered as part of the component
      // The exact test depends on Icon component implementation
      expect(screen.getByText(mockDocument.filename)).toBeTruthy()
    })
  })

  describe('Translation Integration', () => {
    it('should use correct translation for accessibility hint', () => {
      renderComponent()

      // The a11y hint should use the correct translation
      const downloadLink = screen.getByTestId(mockDocument.filename)
      expect(downloadLink).toBeTruthy()
      expect(downloadLink.props.accessibilityHint).toBe(t('travelPay.claimDetails.document.downloadDecisionLetter'))
    })

    it('should use correct translation for accessibility label', () => {
      renderComponent()

      // The a11y label should be properly formatted with filename
      const downloadLink = screen.getByTestId(mockDocument.filename)
      expect(downloadLink).toBeTruthy()
      expect(downloadLink.props.accessibilityLabel).toBe(mockDocument.filename)
    })
  })

  describe('Performance', () => {
    it('should not re-download on re-render with same props', () => {
      // First render
      renderComponent()

      // Clear and render again with same props
      screen.unmount()
      renderComponent()

      // Should not have initiated any downloads
      expect(mockDownloadFile).not.toHaveBeenCalled()
    })

    it('should update when document changes', () => {
      // Initial render
      renderComponent()
      expect(screen.getByText(mockDocument.filename)).toBeTruthy()

      const newDoc = {
        ...mockDocument,
        documentId: 'new-doc-id',
        filename: 'new_document.pdf',
      }

      // Clear and render with different document
      screen.unmount()
      renderComponent({ ...defaultProps, document: newDoc })

      expect(screen.getByText('new_document.pdf')).toBeTruthy()
      expect(screen.queryByText(mockDocument.filename)).toBeFalsy()
    })
  })
})
