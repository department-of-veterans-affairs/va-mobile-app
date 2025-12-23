import React from 'react'
import ReactNativeBlobUtil from 'react-native-blob-util'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { AppointmentAttributes, SummaryObject } from 'api/types'
import AppointmentAfterVisitSummary, {
  getListItemVals,
  handleDismiss,
} from 'screens/HealthScreen/Appointments/AppointmentTypeComponents/SharedComponents/AppointmentAfterVisitSummary'
import appointmentsMocks from 'store/api/demo/mocks/default/appointments.json'
import theme from 'styles/themes/standardTheme'
import { render } from 'testUtils'
import { createFileFromBase64, isValidBase64 } from 'utils/filesystem'
import { defaultAppointmentAttributes } from 'utils/tests/appointments'

describe('AppointmentLocation', () => {
  const initializeTestInstance = (isCerner: boolean, id: string, avsPdf: SummaryObject[] = []) => {
    const attributes: AppointmentAttributes = {
      ...defaultAppointmentAttributes,
      isCerner,
      avsPdf:
        appointmentsMocks['/v0/appointments'].past.data.find((appt) => appt.id === id)?.attributes.avsPdf || avsPdf,
    }
    render(<AppointmentAfterVisitSummary attributes={attributes} />)
  }

  it('should not render section for non-Cerner appointments', () => {
    initializeTestInstance(false, 'testcerner005')
    expect(screen.queryByTestId('avs-container')).toBeNull()
  })

  it('should render section for Cerner appointments with no AVS PDFs, will show text', () => {
    initializeTestInstance(true, 'testcerner006') // does not exist, so [] for avsPdf
    expect(screen.queryByTestId('avs-container')).toBeDefined()
    expect(screen.getByText(t('appointments.afterVisitSummary.noneAvailable'))).toBeDefined()
  })

  it('should render section for Cerner appointments with AVS PDFs, will show single list item with not suffix number', () => {
    initializeTestInstance(true, 'testcerner005')
    expect(screen.queryByTestId('avs-container')).toBeDefined()
    expect(screen.getByText(t('appointments.afterVisitSummary.review.afterVisitSummary', { index: '' }))).toBeDefined()
  })

  it('should render section for Cerner appointments with AVS PDFs, will show 2 list item with suffix numbers', () => {
    initializeTestInstance(true, 'testcerner001')
    expect(screen.queryByTestId('avs-container')).toBeDefined()
    const element = screen.getByText(t('appointments.afterVisitSummary.review.afterVisitSummary', { index: ' 1' }))
    expect(element).toBeDefined()
    expect(
      screen.getByText(t('appointments.afterVisitSummary.review.afterVisitSummary', { index: ' 2' })),
    ).toBeDefined()

    fireEvent.press(element)
    expect(ReactNativeBlobUtil.fs.writeFile).toHaveBeenCalled()
  })

  it('should filter out summaries with invalid base64', () => {
    initializeTestInstance(true, 'testcerner007', [
      {
        apptId: 'test',
        id: '1',
        name: 'Test',
        loincCodes: [],
        noteType: 'afterVisitSummary',
        contentType: 'application/pdf',
        binary: 'invalid-base64',
      },
    ])
    expect(screen.getByText(t('appointments.afterVisitSummary.noneAvailable'))).toBeDefined()
  })

  it('should filter out summaries with empty binary', () => {
    initializeTestInstance(true, 'testcerner007', [
      {
        apptId: 'test',
        id: '1',
        name: 'Test',
        loincCodes: [],
        noteType: 'afterVisitSummary',
        contentType: 'application/pdf',
        binary: '',
      },
    ])
    expect(screen.getByText(t('appointments.afterVisitSummary.noneAvailable'))).toBeDefined()
  })

  it('should handle undefined avsPdf array', () => {
    const attributes: AppointmentAttributes = {
      ...defaultAppointmentAttributes,
      isCerner: true,
      avsPdf: undefined,
    }
    render(<AppointmentAfterVisitSummary attributes={attributes} />)
    expect(screen.getByText(t('appointments.afterVisitSummary.noneAvailable'))).toBeDefined()
  })
})

describe('AppointmentAfterVisitSummary - getListItemVals', () => {
  it('should return empty array when no summaries', () => {
    const result = getListItemVals([], true, theme, t)
    expect(result).toEqual([])
  })

  it('should return filtered list items for Cerner appointment', () => {
    const summaries: SummaryObject[] = [
      {
        apptId: 'test',
        id: '1',
        name: 'Test AVS',
        loincCodes: [],
        noteType: 'ambulatory_patient_summary',
        contentType: 'application/pdf',
        binary: 'VGhpcyBpcyBhIHRlc3QgYmluYXJ5IHN0cmluZw==', // "This is a test binary string" in base64
      },
      {
        apptId: 'test',
        id: '2',
        name: 'Test Other',
        loincCodes: [],
        noteType: 'ambulatory_patient_summary',
        contentType: 'application/pdf',
        binary:
          'JVBERi0xLjQKMSAwIG9iago8PC9UeXBlIC9DYXRhbG9nCi9QYWdlcyAyIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA1OTUgODQyXQovQ29udGVudHMgNSAwIFIKL1Jlc291cmNlcyA8PC9Qcm9jU2V0IFsvUERGIC9UZXh0XQovRm9udCA8PC9GMSA0IDAgUj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9OYW1lIC9GMQovQmFzZUZvbnQgL0hlbHZldGljYQovRW5jb2RpbmcgL01hY1JvbWFuRW5jb2RpbmcKPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDUzCj4+CnN0cmVhbQpCVAovRjEgMjAgVGYKMjIwIDQwMCBUZAooRHVtbXkgUERGKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZgowMDAwMDAwMDA5IDAwMDAwIG4KMDAwMDAwMDA2MyAwMDAwMCBuCjAwMDAwMDAxMjQgMDAwMDAgbgowMDAwMDAwMjc3IDAwMDAwIG4KMDAwMDAwMDM5MiAwMDAwMCBuCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0OTUKJSVFQ0VPRg==',
      },
    ]
    const result = getListItemVals(summaries, true, theme, t)
    expect(result.length).toBe(2)
    expect(result[0].textLines[0].text).toContain('after-visit summary 1')
    expect(result[1].textLines[0].text).toContain('after-visit summary 2')
  })
})

describe('AppointmentAfterVisitSummary - createFileFromBase64', () => {
  it('should create a file from a valid base64 string', async () => {
    const base64String = 'VGhpcyBpcyBhIHRlc3QgYmluYXJ5IHN0cmluZw==' // "This is a test binary string" in base64
    const fileName = 'testfile.txt'
    const filePath = await createFileFromBase64(base64String, fileName)

    // Verify the file was created
    expect(filePath.includes(fileName)).toBe(true)
    expect(ReactNativeBlobUtil.fs.writeFile).toHaveBeenCalledWith(filePath, base64String, 'base64')
  })
})

describe('AppointmentAfterVisitSummary - isValidBase64', () => {
  it('should return true for valid base64 string', () => {
    const validBase64 = 'VGhpcyBpcyBhIHRlc3QgYmluYXJ5IHN0cmluZw=='
    expect(isValidBase64(validBase64)).toBe(true)
  })

  it('should return false for invalid base64 string', () => {
    const invalidBase64 = 'ThisIsNotBase64!!'
    expect(isValidBase64(invalidBase64)).toBe(false)
  })

  it('should return false for empty string', () => {
    const emptyString = ''
    expect(isValidBase64(emptyString)).toBe(true)
  })
})

describe('AppointmentAfterVisitSummary - with avsError', () => {
  it('should not render section when avsError is true', () => {
    const attributes: AppointmentAttributes = {
      ...defaultAppointmentAttributes,
      isCerner: true,
      avsError: 'An error occurred while fetching after visit summaries.',
      avsPdf: [
        {
          apptId: 'test',
          id: '1',
          name: 'Test AVS',
          loincCodes: [],
          noteType: 'ambulatory_patient_summary',
          contentType: 'application/pdf',
          binary: 'VGhpcyBpcyBhIHRlc3QgYmluYXJ5IHN0cmluZw==', // "This is a test binary string" in base64
        },
      ],
    }
    render(<AppointmentAfterVisitSummary attributes={attributes} />)
    expect(screen.queryByTestId('avs-container')).toBeNull()
  })
})

describe('AppointmentAfterVisitSummary - handleDissmiss', () => {
  it('should delete the file when viewer is dismissed', async () => {
    const filePath = '/path/to/testfile.txt'
    const onDismiss = handleDismiss(filePath)

    // Simulate dismissing the viewer
    onDismiss()
    expect(ReactNativeBlobUtil.fs.unlink).toHaveBeenCalledWith(filePath)
  })
})
