import React from 'react'

import { LabsAndTests } from 'api/types'
import { context, mockNavProps, render, screen, waitFor } from 'testUtils'

import LabsAndTestsDetailsScreen from './LabsAndTestsDetailsScreen'

context('LabsAndTestsDetailsScreen', () => {
  const defaultLabsAndTests = {
    id: 'I2-2BCP5BAI6N7NQSAPSVIJ6INQ4A000000',
    type: 'diagnostic_report',
    attributes: {
      display: 'Surgical Pathology',
      testCode: 'SP',
      dateCompleted: '2018-11-01T15:49:14.000-01:00',
      encodedData:
        'RGF0ZSBTcGVjIHRha2VuOiBOb3YgMDEsIDIwMTggMTU6NDkgIFBhdGhvbG9naXN0Ok1VUlRVWkEgTE9LSEFORFdBTEFEYXRlIFNwZWMgcmVjJ2Q6IE5vdiAwMSwgMjAxOCAxNTo1MSAgUmVzaWRlbnQ6IERhdGUgIGNvbXBsZXRlZDogTm92IDAxLCAyMDE4ICAgICAgICBBY2Nlc3Npb24gIzogU1AgMTggNVN1Ym1pdHRlZCBieTogS0FMQUhBU1RJLCBWRU5LQVRBIFMgICBQcmFjdGl0aW9uZXI6UEFETUEgQk9ERFVMVVJJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVNwZWNpbWVuOiBCT05FIE1BUlJPVz0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLT0tLVBlcmZvcm1pbmcgTGFib3JhdG9yeTpTdXJnaWNhbCBQYXRob2xvZ3kgUmVwb3J0IFBlcmZvcm1lZCBCeTogQ0hZU0hSIFRFU1QgTEFCMjM2MCBFIFBFUlNISU5HIEJMVkQgQ0hFWUVOTkUsIEZMIDgyMDAxLTUzNTZudWxs',
      sampleSite: 'TESTING BONE MARROW',
      location: 'VA TEST LAB',
      orderedBy: 'Provider Name',
    },
  }
  const chemHemLabsAndTests = {
    id: 'I2-2BCP5BAI6N7NQSAPSVIJ6INQ4A000000',
    type: 'diagnostic_report',
    attributes: {
      display: 'Chemistry/Hematology',
      testCode: 'CH',
      dateCompleted: '2018-11-01T15:49:14.000-01:00',
      encodedData: '',
      sampleSite: 'TESTING BONE MARROW',
      location: 'VA TEST LAB',
      observations: [
        {
          testCode: 'GLUCOSE',
          valueQuantity: '100',
          referenceRange: '70-100',
          status: 'final',
          comment: 'this is a test',
        },
        {
          testCode: 'UREA NITROGEN',
          valueQuantity: '200 mg/dL',
          referenceRange: '7 - 18',
          status: 'pending',
          comment: '',
        },
        {
          testCode: 'CREATININE',
          valueQuantity: '5 mg/dL',
          referenceRange: '0.6 - 1.3',
          status: 'pending',
          comment: '',
        },
        {
          testCode: 'SODIUM',
          valueQuantity: '8 meq/L',
          referenceRange: '136 - 145',
          status: 'pending',
          comment: '',
        },
      ],
    },
  }

  const initializeTestInstance = (labAndTest: LabsAndTests = defaultLabsAndTests) => {
    const props = mockNavProps(undefined, undefined, { params: { labOrTest: labAndTest } })
    return render(<LabsAndTestsDetailsScreen {...props} />)
  }

  it('base64 decodes the encodedData -- report data', async () => {
    const dataWithAtob = {
      ...defaultLabsAndTests,
    }
    const { getByTestId } = initializeTestInstance({ ...dataWithAtob })
    await waitFor(() =>
      expect(getByTestId('decoded-report').children[0]).toEqual(
        `Date Spec taken: Nov 01, 2018 15:49  Pathologist:MURTUZA LOKHANDWALADate Spec rec'd: Nov 01, 2018 15:51  Resident: Date  completed: Nov 01, 2018        Accession #: SP 18 5Submitted by: KALAHASTI, VENKATA S   Practitioner:PADMA BODDULURI-------------------------------------------------------------------------------Specimen: BONE MARROW=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--=--Performing Laboratory:Surgical Pathology Report Performed By: CHYSHR TEST LAB2360 E PERSHING BLVD CHEYENNE, FL 82001-5356null`,
      ),
    )
  })

  it('renders the placeholder for encodedData if no encodedData is present', async () => {
    const sampleData = {
      ...defaultLabsAndTests,
      attributes: {
        ...defaultLabsAndTests.attributes,
        encodedData: undefined,
      },
    }
    const { getByTestId } = initializeTestInstance({ ...sampleData })
    await waitFor(() => expect(getByTestId('decoded-report').children[0]).toEqual('None noted'))
  })

  it('renders the site sampled correctly', async () => {
    const { getByTestId } = initializeTestInstance()
    await waitFor(() => expect(getByTestId('siteSampled').children[0]).toEqual('TESTING BONE MARROW'))
  })

  it('renders Ordered By correctly', async () => {
    const { getByTestId } = initializeTestInstance()
    await waitFor(() => expect(getByTestId('orderedBy').children[0]).toEqual('Provider Name'))
  })

  it('renders the location correctly', async () => {
    const { getByTestId } = initializeTestInstance()
    await waitFor(() => expect(getByTestId('location').children[0]).toEqual('VA TEST LAB'))
  })

  it('renders the date correctly', async () => {
    const { getByTestId } = initializeTestInstance()
    await waitFor(() => expect(getByTestId('dateCompleted').children[0]).toEqual('November 01, 2018'))
  })

  it('renders the observations correctly when present', async () => {
    initializeTestInstance(chemHemLabsAndTests)
    await waitFor(() => expect(screen.getByText('GLUCOSE')).toBeTruthy())
    await waitFor(() => expect(screen.queryAllByText('Result')).toHaveLength(4))
    await waitFor(() => expect(screen.getByText('100')).toBeTruthy())
    await waitFor(() => expect(screen.queryAllByText('Reference range')).toHaveLength(4))
    await waitFor(() => expect(screen.getByText('70-100')).toBeTruthy())
    await waitFor(() => expect(screen.queryAllByText('Status')).toHaveLength(4))
    await waitFor(() => expect(screen.getByText('final')).toBeTruthy())
    await waitFor(() => expect(screen.queryAllByText('Lab comments')).toHaveLength(4))
    await waitFor(() => expect(screen.getByText('this is a test')).toBeTruthy())
  })

  it('does not show observations if none are present', async () => {
    initializeTestInstance()
    await waitFor(() => expect(screen.queryByText('Result')).toBeFalsy())
    await waitFor(() => expect(screen.queryByText('Reference range')).toBeFalsy())
    await waitFor(() => expect(screen.queryByText('Status')).toBeFalsy())
    await waitFor(() => expect(screen.queryByText('Lab comments')).toBeFalsy())
  })
})
