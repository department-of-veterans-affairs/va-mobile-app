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
  const renderWithBranch = (mostRecentBranch: string) => {
    render(<Nametag />, {
      preloadedState: {
        ...InitialState,
        militaryService: {
          ...InitialState.militaryService,
          mostRecentBranch,
          serviceHistory: [
            {
              branchOfService: 'United States Air Force',
              beginDate: '1998-09-01',
              endDate: '2000-01-01',
              formattedBeginDate: 'September 01, 1998',
              formattedEndDate: 'January 01, 2000',
              characterOfDischarge: 'Honorable',
              honorableServiceIndicator: 'Y',
            },
          ],
        },
        disabilityRating: {
          ...InitialState.disabilityRating,
          ratingData: {
            combinedDisabilityRating: 100,
            combinedEffectiveDate: '2013-08-09T00:00:00.000+00:00',
            legalEffectiveDate: '2013-08-09T00:00:00.000+00:00',
            individualRatings: [],
          },
        },
      },
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  for (const branch of Object.values(BranchesOfServiceConstants)) {
    it(`displays correct icon and text for ${branch}`, () => {
      renderWithBranch(branch)
      expect(screen.getByTestId(branch)).toBeTruthy()
      expect(screen.getByRole('button', { name: branch })).toBeTruthy()
    })
  }

  it('navigates on button press', () => {
    renderWithBranch('United States Air Force')
    fireEvent.press(screen.getByRole('button', { name: 'United States Air Force' }))
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
    expect(screen.queryByRole('button')).toBeFalsy()
  })

  it('does not display branch when militaryService is absent', () => {
    render(<Nametag />, {
      preloadedState: {
        ...InitialState,
      },
    })
    expect(screen.queryByRole('button')).toBeFalsy()
  })
})
