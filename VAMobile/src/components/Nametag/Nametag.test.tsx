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
      fireEvent.press(screen.getByRole('link', { name: branch }))
      expect(mockNavigationSpy).toHaveBeenCalledWith('VeteranStatus')
    })
  }

  it('does not display branch when service history is empty', () => {
    renderWithBranch({} as ServiceHistoryAttributes)
    expect(screen.queryByRole('link')).toBeFalsy()
  })
})
