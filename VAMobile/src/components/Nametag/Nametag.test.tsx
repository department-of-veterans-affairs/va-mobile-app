import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { militaryServiceHistoryKeys } from 'api/militaryService'
import { BranchesOfServiceConstants, ServiceHistoryAttributes } from 'api/types'
import Nametag from 'components/Nametag/Nametag'
import { QueriesData, context, render } from 'testUtils'
import { featureEnabled } from 'utils/remoteConfig'

jest.mock('utils/remoteConfig', () => ({
  featureEnabled: jest.fn(() => false),
}))

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('Nametag', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderWithServiceHistory = (serviceHistory: ServiceHistoryAttributes) => {
    const queriesData: QueriesData = [
      {
        queryKey: militaryServiceHistoryKeys.serviceHistory,
        data: { ...serviceHistory },
      },
    ]
    render(<Nametag />, { queriesData })
  }

  describe('when veteranStatusCardUpdate feature flag is ON (new UI)', () => {
    beforeEach(() => {
      ;(featureEnabled as jest.Mock).mockImplementation((key: string) => key === 'veteranStatusCardUpdate')
    })

    it('renders VA seal + "Veteran Status Card" and navigates on press', () => {
      render(<Nametag />)

      expect(screen.getByTestId('VASeal')).toBeTruthy()
      expect(screen.getByText('Veteran Status Card')).toBeTruthy()

      fireEvent.press(screen.getByRole('link', { name: 'Veteran Status Card' }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('VeteranStatus')
    })
  })

  describe('when veteranStatusCardUpdate feature flag is OFF (legacy UI)', () => {
    beforeEach(() => {
      ;(featureEnabled as jest.Mock).mockImplementation(() => false)
    })

    it('renders branch emblem + branch text and navigates on press', () => {
      const branch = BranchesOfServiceConstants.SpaceForce
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

      renderWithServiceHistory(serviceHistoryMock)

      expect(screen.getByTestId(`${branch} Emblem`)).toBeTruthy()
      expect(screen.getByText(branch)).toBeTruthy()

      fireEvent.press(screen.getByRole('link', { name: `${branch} Veteran Status Card` }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('VeteranStatus')
    })

    it('does not render branch text when service history is empty', () => {
      renderWithServiceHistory({} as ServiceHistoryAttributes)

      expect(screen.getByRole('link')).toBeTruthy()
      expect(
        screen.queryByText(
          /United States (Air Force|Army|Coast Guard|Marine Corps|Navy|DoD|Public Health Service|NOAA|Space Force)/i,
        ),
      ).toBeNull()
    })
  })
})
