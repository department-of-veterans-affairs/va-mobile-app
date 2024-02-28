import React from 'react'

import { screen } from '@testing-library/react-native'
import { waitFor } from '@testing-library/react-native'

import { militaryServiceHistoryKeys } from 'api/militaryService'
import { BranchesOfServiceConstants, ServiceHistoryAttributes } from 'api/types'
import { QueriesData, context, mockNavProps, render } from 'testUtils'

import MilitaryInformationScreen from './index'

jest.mock('../../../../api/authorizedServices/getAuthorizedServices', () => {
  const original = jest.requireActual('../../../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest
      .fn()
      .mockReturnValue({
        status: 'success',
        data: {
          appeals: true,
          appointments: true,
          claims: true,
          decisionLetters: true,
          directDepositBenefits: true,
          directDepositBenefitsUpdate: true,
          disabilityRating: true,
          genderIdentity: true,
          lettersAndDocuments: true,
          militaryServiceHistory: true,
          paymentHistory: true,
          preferredName: true,
          prescriptions: true,
          scheduleAppointments: true,
          secureMessaging: true,
          userProfileUpdate: true,
        },
      })
      .mockReturnValueOnce({
        status: 'success',
        data: {
          appeals: true,
          appointments: true,
          claims: true,
          decisionLetters: true,
          directDepositBenefits: true,
          directDepositBenefitsUpdate: true,
          disabilityRating: true,
          genderIdentity: true,
          lettersAndDocuments: true,
          militaryServiceHistory: false,
          paymentHistory: true,
          preferredName: true,
          prescriptions: true,
          scheduleAppointments: true,
          secureMessaging: true,
          userProfileUpdate: true,
        },
      }),
  }
})

context('MilitaryInformationScreen', () => {
  const serviceHistoryMock: ServiceHistoryAttributes = {
    serviceHistory: [
      {
        branchOfService: BranchesOfServiceConstants.MarineCorps,
        beginDate: '1993-06-04',
        endDate: '1995-07-10',
        formattedBeginDate: 'June 04, 1993',
        formattedEndDate: 'July 10, 1995',
        characterOfDischarge: 'Honorable',
        honorableServiceIndicator: 'Y',
      },
    ],
  }
  const props = mockNavProps(
    {},
    {
      setOptions: jest.fn(),
      navigate: jest.fn(),
      addListener: jest.fn(),
    },
  )
  const initializeTestInstance = (serviceHistory = serviceHistoryMock) => {
    const queriesData: QueriesData = [
      {
        queryKey: militaryServiceHistoryKeys.serviceHistory,
        data: {
          ...serviceHistory,
        },
      },
    ]
    render(<MilitaryInformationScreen {...props} />, { queriesData })
  }

  describe('when military service history authorization is false', () => {
    it('should render NoMilitaryInformationAccess', async () => {
      await waitFor(() => {
        initializeTestInstance()
      })
      expect(screen.getByText("We can't access your military information")).toBeTruthy()
    })
  })

  describe('when service history is empty', () => {
    it('should render NoMilitaryInformationAccess', async () => {
      await waitFor(() => {
        initializeTestInstance({} as ServiceHistoryAttributes)
      })
      expect(screen.getByText("We can't access your military information")).toBeTruthy()
    })
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      initializeTestInstance()
    })
    expect(screen.queryByText("We can't access your military information")).toBeFalsy()
    expect(screen.getByText('Period of service')).toBeTruthy()
    expect(screen.getByText('United States Marine Corps')).toBeTruthy()
    expect(screen.getByText('June 04, 1993 – July 10, 1995')).toBeTruthy()
    expect(screen.getByText("What if my military service information doesn't look right?")).toBeTruthy()
    expect(screen.getByRole('link')).toBeTruthy()
  })
})
