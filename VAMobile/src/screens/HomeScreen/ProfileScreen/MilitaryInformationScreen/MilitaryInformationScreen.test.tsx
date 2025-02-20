import React from 'react'

import { screen } from '@testing-library/react-native'
import { waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import { militaryServiceHistoryKeys } from 'api/militaryService'
import { BranchesOfServiceConstants, MilitaryServiceHistoryData, ServiceHistoryAttributes } from 'api/types'
import * as api from 'store/api'
import { QueriesData, context, mockNavProps, render, when } from 'testUtils'

import MilitaryInformationScreen from './index'

context('MilitaryInformationScreen', () => {
  const serviceHistoryMockAtributes = {
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
        ...serviceHistoryMockAtributes,
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

  describe('when service history is empty', () => {
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

  it('initializes correctly', async () => {
    const militaryServiceHistoryData: MilitaryServiceHistoryData = {
      data: {
        type: 'a',
        id: 'string',
        attributes: serviceHistoryMock,
      },
    }
    when(api.get as jest.Mock)
      .calledWith('/v0/military-service-history')
      .mockResolvedValue(militaryServiceHistoryData)
    const { branchOfService, formattedBeginDate, formattedEndDate } = serviceHistoryMockAtributes
    initializeTestInstance()
    await waitFor(() => expect(screen.queryByText(t('militaryInformation.noMilitaryInfoAccess.title'))).toBeFalsy())
    await waitFor(() => expect(screen.getByText(t('militaryInformation.periodOfService'))).toBeTruthy())
    await waitFor(() => expect(screen.getByText(branchOfService)).toBeTruthy())
    await waitFor(() => expect(screen.getByText(`${formattedBeginDate} – ${formattedEndDate}`)).toBeTruthy())
    await waitFor(() =>
      expect(screen.getByRole('link', { name: t('militaryInformation.incorrectServiceInfo') })).toBeTruthy(),
    )
  })
})
