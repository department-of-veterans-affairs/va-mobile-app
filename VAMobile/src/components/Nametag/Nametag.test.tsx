import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { militaryServiceHistoryKeys } from 'api/militaryService'
import { BranchesOfServiceConstants, ServiceHistoryAttributes } from 'api/types'
import { QueriesData, context, render } from 'testUtils'

import Nametag from './Nametag'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('Nametag', () => {
  const renderWithBranch = (mostRecentBranch: string) => {
    render(<Nametag screen="Profile" />, {
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
    render(<Nametag screen="Profile" />, {
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
    render(<Nametag screen="Profile" />, {
      preloadedState: {
        ...InitialState,
      },
    })
    expect(screen.queryByRole('link')).toBeFalsy()
  })
})
