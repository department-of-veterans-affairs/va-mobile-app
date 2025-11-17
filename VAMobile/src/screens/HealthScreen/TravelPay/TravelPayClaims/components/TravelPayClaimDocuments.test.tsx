import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { TravelPayClaimDocument } from 'api/types'
import TravelPayClaimDocuments from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimDocuments'
import { context, render } from 'testUtils'

// Mock the onDocumentPress callback
const mockOnDocumentPress = jest.fn()

// Test data
const mockUserDocument1: TravelPayClaimDocument = {
  documentId: 'doc-123',
  filename: 'receipt-1.pdf',
  mimetype: 'application/pdf',
  createdon: '2025-01-15T10:00:00.000Z',
}

const mockUserDocument2: TravelPayClaimDocument = {
  documentId: 'doc-456',
  filename: 'mileage-form.pdf',
  mimetype: 'application/pdf',
  createdon: '2025-01-16T11:00:00.000Z',
}

const mockDecisionLetter: TravelPayClaimDocument = {
  documentId: 'doc-789',
  filename: 'Decision Letter.pdf',
  mimetype: 'application/pdf',
  createdon: '2025-01-17T12:00:00.000Z',
}

const mockRejectionLetter: TravelPayClaimDocument = {
  documentId: 'doc-101',
  filename: 'Rejection Letter.pdf',
  mimetype: 'application/pdf',
  createdon: '2025-01-18T13:00:00.000Z',
}

const mockClaimId = 'claim-001'
const mockClaimStatus = 'In process'

context('TravelPayClaimDocuments', () => {
  const renderComponent = (
    documents: TravelPayClaimDocument[],
    claimId: string = mockClaimId,
    claimStatus: string = mockClaimStatus,
  ) => {
    render(
      <TravelPayClaimDocuments
        documents={documents}
        claimId={claimId}
        claimStatus={claimStatus}
        onDocumentPress={mockOnDocumentPress}
      />,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Component Rendering', () => {
    it('should render accordion with correct header', () => {
      renderComponent([mockUserDocument1, mockUserDocument2])

      expect(screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))).toBeTruthy()
      expect(screen.getByTestId('travelPayClaimInformationDocumentsAccordion')).toBeTruthy()
    })

    it('should not render when there are no documents', () => {
      renderComponent([])

      expect(screen.queryByText(t('travelPay.claimDetails.information.documentsSubmitted'))).toBeFalsy()
      expect(screen.queryByTestId('travelPayClaimInformationDocumentsAccordion')).toBeFalsy()
    })

    it('should not render when only Decision Letters exist', () => {
      renderComponent([mockDecisionLetter])

      expect(screen.queryByText(t('travelPay.claimDetails.information.documentsSubmitted'))).toBeFalsy()
      expect(screen.queryByText('Decision Letter.pdf')).toBeFalsy()
    })

    it('should not render when only Rejection Letters exist', () => {
      renderComponent([mockRejectionLetter])

      expect(screen.queryByText(t('travelPay.claimDetails.information.documentsSubmitted'))).toBeFalsy()
      expect(screen.queryByText('Rejection Letter.pdf')).toBeFalsy()
    })
  })

  describe('Document Filtering', () => {
    it('should render accordion when user documents exist along with Decision Letters', () => {
      renderComponent([mockUserDocument1, mockDecisionLetter])

      // Accordion should render because there's at least one user document
      expect(screen.getByTestId('travelPayClaimInformationDocumentsAccordion')).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))).toBeTruthy()
    })

    it('should render accordion when user documents exist along with Rejection Letters', () => {
      renderComponent([mockUserDocument1, mockRejectionLetter])

      // Accordion should render because there's at least one user document
      expect(screen.getByTestId('travelPayClaimInformationDocumentsAccordion')).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))).toBeTruthy()
    })

    it('should render accordion when multiple user documents exist with Decision and Rejection Letters', () => {
      renderComponent([mockUserDocument1, mockUserDocument2, mockDecisionLetter, mockRejectionLetter])

      // Accordion should render because there are user documents
      expect(screen.getByTestId('travelPayClaimInformationDocumentsAccordion')).toBeTruthy()
      expect(screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))).toBeTruthy()
    })

    it('should not render if all documents are Decision or Rejection Letters', () => {
      renderComponent([mockDecisionLetter, mockRejectionLetter])

      expect(screen.queryByTestId('travelPayClaimInformationDocumentsAccordion')).toBeFalsy()
    })
  })

  describe('Accordion Functionality', () => {
    it('should display accordion in collapsed state initially', () => {
      renderComponent([mockUserDocument1])

      const accordion = screen.getByTestId('travelPayClaimInformationDocumentsAccordion')
      expect(accordion).toBeTruthy()

      // The accordion header should be visible
      expect(screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))).toBeTruthy()
    })
  })

  describe('Expanded Accordion Functionality', () => {
    it('should display document filenames when accordion is expanded', () => {
      renderComponent([mockUserDocument1, mockUserDocument2])

      // Expand the accordion
      const header = screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))
      fireEvent.press(header)

      // Documents should now be visible
      expect(screen.getByText('receipt-1.pdf')).toBeTruthy()
      expect(screen.getByText('mileage-form.pdf')).toBeTruthy()
    })

    it('should display only user-submitted documents when expanded (filtering Decision Letters)', () => {
      renderComponent([mockUserDocument1, mockDecisionLetter])

      // Expand the accordion
      const header = screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))
      fireEvent.press(header)

      // User document should be visible, Decision Letter should not
      expect(screen.getByText('receipt-1.pdf')).toBeTruthy()
      expect(screen.queryByText('Decision Letter.pdf')).toBeFalsy()
    })

    it('should display only user-submitted documents when expanded (filtering Rejection Letters)', () => {
      renderComponent([mockUserDocument1, mockRejectionLetter])

      // Expand the accordion
      const header = screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))
      fireEvent.press(header)

      // User document should be visible, Rejection Letter should not
      expect(screen.getByText('receipt-1.pdf')).toBeTruthy()
      expect(screen.queryByText('Rejection Letter.pdf')).toBeFalsy()
    })

    it('should call downloadDocument when a document is pressed after expanding', () => {
      renderComponent([mockUserDocument1])

      // Expand the accordion
      const header = screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))
      fireEvent.press(header)

      // Press the document
      const documentLink = screen.getByText('receipt-1.pdf')
      fireEvent.press(documentLink)

      expect(mockOnDocumentPress).toHaveBeenCalledWith('doc-123', 'receipt-1.pdf')
    })

    it('should call onDocumentPress with correct parameters for each document', () => {
      renderComponent([mockUserDocument1, mockUserDocument2])

      // Expand the accordion
      const header = screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))
      fireEvent.press(header)

      // Press first document
      const document1 = screen.getByText('receipt-1.pdf')
      fireEvent.press(document1)

      expect(mockOnDocumentPress).toHaveBeenCalledWith('doc-123', 'receipt-1.pdf')

      // Press second document
      const document2 = screen.getByText('mileage-form.pdf')
      fireEvent.press(document2)

      expect(mockOnDocumentPress).toHaveBeenCalledWith('doc-456', 'mileage-form.pdf')

      expect(mockOnDocumentPress).toHaveBeenCalledTimes(2)
    })

    it('should display multiple documents correctly when expanded', () => {
      const multipleDocuments: TravelPayClaimDocument[] = [
        { ...mockUserDocument1, documentId: 'doc-1', filename: 'file1.pdf' },
        { ...mockUserDocument1, documentId: 'doc-2', filename: 'file2.pdf' },
        { ...mockUserDocument1, documentId: 'doc-3', filename: 'file3.pdf' },
      ]

      renderComponent(multipleDocuments)

      // Expand the accordion
      const header = screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))
      fireEvent.press(header)

      // All documents should be visible
      expect(screen.getByText('file1.pdf')).toBeTruthy()
      expect(screen.getByText('file2.pdf')).toBeTruthy()
      expect(screen.getByText('file3.pdf')).toBeTruthy()
    })

    it('should display documents with special characters when expanded', () => {
      const specialDoc: TravelPayClaimDocument = {
        ...mockUserDocument1,
        filename: 'Receipt (2024-01-15) #1.pdf',
      }

      renderComponent([specialDoc])

      // Expand the accordion
      const header = screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))
      fireEvent.press(header)

      // Document with special characters should be visible
      expect(screen.getByText('Receipt (2024-01-15) #1.pdf')).toBeTruthy()
    })

    it('should display documents with long filenames when expanded', () => {
      const longFilenameDoc: TravelPayClaimDocument = {
        ...mockUserDocument1,
        filename: 'Very-Long-Filename-That-Contains-Many-Characters-And-Details-About-The-Document.pdf',
      }

      renderComponent([longFilenameDoc])

      // Expand the accordion
      const header = screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))
      fireEvent.press(header)

      // Document with long filename should be visible
      expect(
        screen.getByText('Very-Long-Filename-That-Contains-Many-Characters-And-Details-About-The-Document.pdf'),
      ).toBeTruthy()
    })
  })

  describe('Accessibility', () => {
    it('should have header with proper accessibility role', () => {
      renderComponent([mockUserDocument1])

      const header = screen.getByText(t('travelPay.claimDetails.information.documentsSubmitted'))
      expect(header.props.accessibilityRole).toBe('header')
    })
  })
})
