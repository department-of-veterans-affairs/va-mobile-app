import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { LabsAndTests } from 'api/types'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

import LabsAndTestsListScreen from './LabsAndTestsListScreen'

context('LabsAndTestsListScreen', () => {
  const defaultLabsAndTests = [
    {
      id: 'I2-2BCP5BAI6N7NQSAPSVIJ6INQ4A000000',
      type: 'diagnostic_report',
      attributes: {
        display: 'Surgical Pathology',
        testCode: 'SP',
        dateCompleted: '2025-02-06T18:53:14.000-01:00',
        encodedData:
          'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
        sampleSite: 'TESTING BONE MARROW',
        location: 'VA TEST LAB',
      },
    },
  ]

  const initializeTestInstance = (labAndTest: Array<LabsAndTests> = defaultLabsAndTests) => {
    const props = mockNavProps(undefined, undefined, { params: { labOrTest: labAndTest } })
    return render(<LabsAndTestsListScreen {...props} />)
  }

  it('renders the LabsAndTestsListScreen', () => {
    const { getByTestId } = initializeTestInstance()
    expect(getByTestId('labs-and-tests-list-screen')).toBeTruthy()
  })

  it('defaults to 3 months in date picker', async () => {
    const { getByTestId } = initializeTestInstance()
    expect(getByTestId('labsAndTestDataRangeTestID')).toBeTruthy()
    expect(getByTestId('labsAndTestDataRangeTestID').children[0]).toEqual('Past 3 months')
  })

  it('renders the correct availability timing', async () => {
    const { getByTestId } = initializeTestInstance()
    await waitFor(() => expect(getByTestId('labsAndTestsAvailabilityTimingTestID').children[0]).toEqual('36 hours'))
  })

  it('renders the expected data in the list of Labs and Tests', async () => {
    when(api.get as jest.Mock)
      .calledWith('/v0/health/labs-and-tests', expect.anything())
      .mockResolvedValue({ data: defaultLabsAndTests })
    initializeTestInstance()
    await waitFor(() => expect(screen.getByText('Surgical Pathology')).toBeTruthy())
  })

  it('renders the expected number of Labs and Tests', async () => {
    const sampleData: Array<LabsAndTests> = [
      {
        id: 'I2-2BCP5BAI4R7NQSAPSVIJ9WNQ4A000000',
        type: 'diagnostic_report',
        attributes: {
          display: 'Surgical Pathology',
          testCode: 'SP',
          dateCompleted: '2025-01-16T18:53:14.000-01:00',
          encodedData:
            'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
          sampleSite: 'Brain',
          location: 'VA TEST LAB',
        },
      },
      {
        id: 'I2-2ASP4NNI4R7NQSAPSVIJ6WFL4A000000',
        type: 'diagnostic_report',
        attributes: {
          display: 'Surgical Pathology',
          testCode: 'SP',
          dateCompleted: '2025-02-14T18:53:14.000-01:00',
          encodedData:
            'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
          sampleSite: 'Heart',
          location: 'VA TEST LAB 1000',
        },
      },
    ]
    const combinedData = [...sampleData, ...defaultLabsAndTests]
    when(api.get as jest.Mock)
      .calledWith('/v0/health/labs-and-tests', expect.anything())
      .mockResolvedValue({ data: combinedData })
    initializeTestInstance()
    await waitFor(() => expect(screen.queryAllByText('Surgical Pathology')).toHaveLength(3))
  })

  it('renders the placeholder for labs and tests if no labs and tests are present', async () => {
    const sampleData: Array<LabsAndTests> = []
    when(api.get as jest.Mock)
      .calledWith('/v0/health/labs-and-tests', expect.anything())
      .mockResolvedValue({ data: sampleData })
    const { getByTestId } = initializeTestInstance()
    await waitFor(() => expect(getByTestId('NoLabsAndTestsRecords')).toBeTruthy()).then(() => {
      expect(screen.queryAllByText('Sugical Pathology')).toHaveLength(0)
    })
    await waitFor(() =>
      expect(screen.queryAllByText("We couldn't find information about your labs and tests")).toHaveLength(1),
    )
  })

  it('shows an error message when there is an error fetching Labs and Tests', async () => {
    when(api.get as jest.Mock)
      .calledWith('/v0/health/labs-and-tests', expect.anything())
      .mockRejectedValue({ networkError: true } as api.APIError)

    initializeTestInstance()
    await waitFor(() => expect(screen.getByRole('header', { name: "The app can't be loaded." })).toBeTruthy())
  })

  // test pagination when more than ten labs and tests are present
  it('renders the expected number of Labs and Tests when more than ten are present', async () => {
    const sampleDataOfTen: Array<LabsAndTests> = [
      {
        id: 'I2-2BCP5BAI4R7NQSAPSVIJ9WNQ4A000000',
        type: 'diagnostic_report',
        attributes: {
          display: 'Surgical Pathology',
          testCode: 'SP',
          dateCompleted: '2025-01-16T18:53:14.000-01:00',
          encodedData:
            'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
          sampleSite: 'Brain',
          location: 'VA TEST LAB',
        },
      },
      {
        id: 'I2-2ASP4NNI4R7NQSAPSVIJ6WFL4A000000',
        type: 'diagnostic_report',
        attributes: {
          display: 'Surgical Pathology',
          testCode: 'SP',
          dateCompleted: '2025-02-14T18:53:14.000-01:00',
          encodedData:
            'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
          sampleSite: 'Heart',
          location: 'VA TEST LAB 1000',
        },
      },
      {
        id: 'I2-2BCP5BAI4R7NQSAPSVIJ9WNQ4A000000',
        type: 'diagnostic_report',
        attributes: {
          display: 'Surgical Pathology',
          testCode: 'SP',
          dateCompleted: '2025-01-16T18:53:14.000-01:00',
          encodedData:
            'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
          sampleSite: 'Brain',
          location: 'VA TEST LAB',
        },
      },
      {
        id: 'I2-2ASP4NNI4R7NQSAPSVIJ6WFL4A000000',
        type: 'diagnostic_report',
        attributes: {
          display: 'Surgical Pathology',
          testCode: 'SP',
          dateCompleted: '2025-02-14T18:53:14.000-01:00',
          encodedData:
            'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
          sampleSite: 'Heart',
          location: 'VA TEST LAB 1000',
        },
      },
      {
        id: 'I2-2BCP5BAI4R7NQSAPSVIJ9WNQ4A000000',
        type: 'diagnostic_report',
        attributes: {
          display: 'Surgical Pathology',
          testCode: 'SP',
          dateCompleted: '2025-01-16T18:53:14.000-01:00',
          encodedData:
            'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
          sampleSite: 'Brain',
          location: 'VA TEST LAB',
        },
      },
      {
        id: 'I2-2ASP4NNI4R7NQSAPSVIJ6WFL4A000000',
        type: 'diagnostic_report',
        attributes: {
          display: 'Surgical Pathology',
          testCode: 'SP',
          dateCompleted: '2025-02-14T18:53:14.000-01:00',
          encodedData:
            'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
          sampleSite: 'Heart',
          location: 'VA TEST LAB 1000',
        },
      },
      {
        id: 'I2-2BCP5BAI4R7NQSAPSVIJ9WNQ4A000000',
        type: 'diagnostic_report',
        attributes: {
          display: 'Surgical Pathology',
          testCode: 'SP',
          dateCompleted: '2025-01-16T18:53:14.000-01:00',
          encodedData:
            'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
          sampleSite: 'Brain',
          location: 'VA TEST LAB',
        },
      },
      {
        id: 'I2-2ASP4NNI4R7NQSAPSVIJ6WFL4A000000',
        type: 'diagnostic_report',
        attributes: {
          display: 'Surgical Pathology',
          testCode: 'SP',
          dateCompleted: '2025-02-14T18:53:14.000-01:00',
          encodedData:
            'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
          sampleSite: 'Heart',
          location: 'VA TEST LAB 1000',
        },
      },
      {
        id: 'I2-2BCP5BAI4R7NQSAPSVIJ9WNQ4A000000',
        type: 'diagnostic_report',
        attributes: {
          display: 'Surgical Pathology',
          testCode: 'SP',
          dateCompleted: '2025-01-16T18:53:14.000-01:00',
          encodedData:
            'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
          sampleSite: 'Brain',
          location: 'VA TEST LAB',
        },
      },
      {
        id: 'I2-2ASP4NNI4R7NQSAPSVIJ6WFL4A000000',
        type: 'diagnostic_report',
        attributes: {
          display: 'Surgical Pathology',
          testCode: 'SP',
          dateCompleted: '2025-02-14T18:53:14.000-01:00',
          encodedData:
            'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
          sampleSite: 'Heart',
          location: 'VA TEST LAB 1000',
        },
      },
    ]
    const combinedData = [...sampleDataOfTen, ...defaultLabsAndTests]
    when(api.get as jest.Mock)
      .calledWith('/v0/health/labs-and-tests', expect.anything())
      .mockResolvedValue({ data: combinedData })
    const { getByTestId } = initializeTestInstance()
    await waitFor(() => expect(screen.queryAllByText('Surgical Pathology')).toHaveLength(10))
    await waitFor(() => expect(screen.queryAllByText('1 to 10 of 11')).toHaveLength(1))

    await waitFor(() => expect(getByTestId('next-page')).toBeTruthy())
    await waitFor(() => expect(getByTestId('previous-page')).toBeTruthy())

    fireEvent.press(getByTestId('next-page'))
    await waitFor(() => expect(screen.queryAllByText('Surgical Pathology')).toHaveLength(1))
    await waitFor(() => expect(screen.queryAllByText('11 to 11 of 11')).toHaveLength(1))
  })
})
