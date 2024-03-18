import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { BranchesOfServiceConstants } from 'store/api/types'
import { InitialState } from 'store/slices'
import { context, render } from 'testUtils'

import Nametag from './Nametag'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('../../api/authorizedServices/getAuthorizedServices', () => {
  const original = jest.requireActual('../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest.fn().mockReturnValue({
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
    }),
  }
})

context('Nametag', () => {
  const renderWithBranch = (serviceHistory: ServiceHistoryAttributes) => {
    const queriesData: QueriesData = [
      {
        queryKey: militaryServiceHistoryKeys.serviceHistory,
        data: {
          ...serviceHistory,
        },
      },
    ]
    render(<Nametag />, { queriesData })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  for (const branch of Object.values(BranchesOfServiceConstants)) {
    it(`displays correct icon and text for ${branch}`, () => {
      const serviceHistoryMock: ServiceHistoryAttributes = {
        serviceHistory: [
          {
            branchOfService: branch,
            beginDate: '1993-06-04',
            endDate: '1995-07-10',
            formattedBeginDate: 'June 04, 1993',
            formattedEndDate: 'July 10, 1995',
            characterOfDischarge: 'Honorable',
            honorableServiceIndicator: 'Y',
          },
        ],
        mostRecentBranch: branch,
      }
      renderWithBranch(serviceHistoryMock)
      expect(screen.getByTestId(branch)).toBeTruthy()
      expect(screen.getByRole('link', { name: branch })).toBeTruthy()
    })
  }

  it('navigates on button press', () => {
    renderWithBranch('United States Air Force')
    fireEvent.press(screen.getByRole('link', { name: 'United States Air Force' }))
    expect(mockNavigationSpy).toHaveBeenCalledWith('VeteranStatus')
  })

  it('does not display branch when service history is empty', () => {
    render(<Nametag />, {
      preloadedState: {
        ...InitialState,
        militaryService: {
          ...InitialState.militaryService,
          serviceHistory: [],
        },
      },
    })
    expect(screen.queryByRole('link')).toBeFalsy()
  })

  it('does not display branch when militaryService is absent', () => {
    render(<Nametag />, {
      preloadedState: {
        ...InitialState,
      },
    })
    expect(screen.queryByRole('link')).toBeFalsy()
  })
})
