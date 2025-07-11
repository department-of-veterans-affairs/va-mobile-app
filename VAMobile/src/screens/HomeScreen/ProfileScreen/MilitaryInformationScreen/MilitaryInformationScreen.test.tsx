import React from 'react'

import { screen } from '@testing-library/react-native'
import { waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import { militaryServiceHistoryKeys } from 'api/militaryService'
import { BranchesOfServiceConstants, MilitaryServiceHistoryData, ServiceHistoryAttributes } from 'api/types'
import MilitaryInformationScreen from 'screens/HomeScreen/ProfileScreen/MilitaryInformationScreen/MilitaryInformationScreen'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, when } from 'testUtils'

context('MilitaryInformationScreen', () => {
  const serviceHistoryMockAttributes = {
    branchOfService: BranchesOfServiceConstants.MarineCorps,
    beginDate: '1993-06-04',
    endDate: '1995-07-10',
    formattedBeginDate: 'June 04, 1993',
    formattedEndDate: 'July 10, 1995',
    characterOfDischarge: 'Honorable',
    honorableServiceIndicator: 'Y',
  }
  const serviceHistoryMock: ServiceHistoryAttributes = {
    serviceHistory: [
      {
        ...serviceHistoryMockAttributes,
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
  const initializeTestInstance = (serviceHistory = serviceHistoryMock, authorized = true) => {
    const queriesData: QueriesData = [
      {
        queryKey: militaryServiceHistoryKeys.serviceHistory,
        data: {
          ...serviceHistory,
        },
      },
      {
        queryKey: authorizedServicesKeys.authorizedServices,
        data: {
          appeals: true,
          appointments: true,
          claims: true,
          decisionLetters: true,
          directDepositBenefits: true,
          directDepositBenefitsUpdate: true,
          disabilityRating: true,
          lettersAndDocuments: true,
          militaryServiceHistory: authorized,
          paymentHistory: true,
          preferredName: true,
          prescriptions: true,
          scheduleAppointments: true,
          secureMessaging: true,
          userProfileUpdate: true,
        },
      },
    ]
    render(<MilitaryInformationScreen {...props} />, { queriesData })
  }

  const verifyMilitaryInfo = async (
    branchOfService: (typeof BranchesOfServiceConstants)[keyof typeof BranchesOfServiceConstants],
  ) => {
    it('should render correctly for ' + branchOfService, async () => {
      const serviceHistory = [
        {
          ...serviceHistoryMockAttributes,
          branchOfService,
        },
      ]
      const militaryServiceHistoryData: MilitaryServiceHistoryData = {
        data: {
          type: 'a',
          id: 'string',
          attributes: {
            serviceHistory: serviceHistory,
          },
        },
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/military-service-history')
        .mockResolvedValue(militaryServiceHistoryData)
      const { formattedBeginDate, formattedEndDate } = serviceHistoryMockAttributes
      initializeTestInstance({ serviceHistory })
      await waitFor(() => expect(screen.queryByText(t('militaryInformation.noMilitaryInfoAccess.title'))).toBeFalsy())
      await waitFor(() => expect(screen.getByText(t('militaryInformation.periodOfService'))).toBeTruthy())
      await waitFor(() => expect(screen.getByText(branchOfService)).toBeTruthy())
      await waitFor(() => expect(screen.getByText(`${formattedBeginDate} – ${formattedEndDate}`)).toBeTruthy())
      await waitFor(() =>
        expect(screen.getByRole('link', { name: t('militaryInformation.incorrectServiceInfo') })).toBeTruthy(),
      )
    })
  }

  describe('when military service history authorization is false', () => {
    it('should render NoMilitaryInformationAccess', async () => {
      const militaryServiceHistoryData = {
        data: {
          type: 'a',
          id: 'string',
          attributes: {
            serviceHistory: [],
          },
        },
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/military-service-history')
        .mockResolvedValue(militaryServiceHistoryData)
      initializeTestInstance(undefined, false)
      await waitFor(() => expect(screen.getByText(t('militaryInformation.noMilitaryInfoAccess.title'))).toBeTruthy())
    })
  })

  describe('when military service history is empty', () => {
    it('should render NoMilitaryInformationAccess', async () => {
      const militaryServiceHistoryData = {
        data: {
          type: 'a',
          id: 'string',
          attributes: {
            serviceHistory: [],
          },
        },
      }
      when(api.get as jest.Mock)
        .calledWith('/v0/military-service-history')
        .mockResolvedValue(militaryServiceHistoryData)
      initializeTestInstance({} as ServiceHistoryAttributes)
      await waitFor(() => expect(screen.getByText(t('militaryInformation.noMilitaryInfoAccess.title'))).toBeTruthy())
    })
  })

  describe('when military service history is not empty', () => {
    verifyMilitaryInfo(BranchesOfServiceConstants.AirForce)
    verifyMilitaryInfo(BranchesOfServiceConstants.Army)
    verifyMilitaryInfo(BranchesOfServiceConstants.CoastGuard)
    verifyMilitaryInfo(BranchesOfServiceConstants.MarineCorps)
    verifyMilitaryInfo(BranchesOfServiceConstants.Navy)
    verifyMilitaryInfo(BranchesOfServiceConstants.SpaceForce)
  })
})
