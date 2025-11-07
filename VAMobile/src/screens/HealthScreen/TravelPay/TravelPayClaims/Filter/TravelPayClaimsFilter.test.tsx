import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'

import { TravelPayClaimData } from 'api/types'
import TravelPayClaimsFilter from 'screens/HealthScreen/TravelPay/TravelPayClaims/Filter/TravelPayClaimsFilter'
import { context, render } from 'testUtils'
import { FILTER_KEY_ALL, SortOption } from 'utils/travelPay'

const claims: Array<TravelPayClaimData> = [
  {
    id: 'f33ef640000f4ecf82b81c50df13d178',
    type: 'travelPayClaimSummary',
    attributes: {
      id: 'f33ef640000f4ecf82b81c50df13d178',
      claimNumber: 'c68baadf3d9545d5857beca5bef6d4a5',
      claimStatus: 'Claim submitted',
      appointmentDateTime: '20250810T20:54:34.828Z',
      facilityName: 'Cheyenne VA Medical Center',
      createdOn: '20250811T20:54:34.828Z',
      modifiedOn: '20250811T20:54:34.828Z',
      totalCostRequested: 50.0,
      reimbursementAmount: 50.0,
    },
  },
  {
    id: '352b37f23566464298b26a2bc0e63757',
    type: 'travelPayClaimSummary',
    attributes: {
      id: '352b37f23566464298b26a2bc0e63757',
      claimNumber: '93b5fff2a71d4b979e983298ae0564db',
      claimStatus: 'Saved',
      appointmentDateTime: '20250809T20:54:34.828Z',
      facilityName: 'Tomah VA Medical Center',
      createdOn: '20250810T20:54:34.828Z',
      modifiedOn: '20250810T20:54:34.828Z',
      totalCostRequested: 50.0,
      reimbursementAmount: 25.0,
    },
  },
  {
    id: '16cbc3d056de4d86abf3ed0f6908ee53',
    type: 'travelPayClaimSummary',
    attributes: {
      id: '16cbc3d056de4d86abf3ed0f6908ee53',
      claimNumber: '5b550fe769854a69953a472d5cf85921',
      claimStatus: 'In process',
      appointmentDateTime: '20250807T20:54:34.828Z',
      facilityName: 'Tomah VA Medical Center',
      createdOn: '20250809T20:54:34.828Z',
      modifiedOn: '20250809T20:54:34.828Z',
      totalCostRequested: 50.0,
      reimbursementAmount: 20.0,
    },
  },
]

context('TravelPayClaimsFilter', () => {
  it('renders the correct elements', () => {
    render(
      <TravelPayClaimsFilter
        claims={[]}
        totalClaims={0}
        filter={new Set()}
        onFilterChanged={jest.fn()}
        sortBy={SortOption.Recent}
        onSortByChanged={jest.fn()}
      />,
    )

    expect(screen.getByTestId('travelPayClaimsFilterModalContainer')).toBeTruthy()
  })

  it('renders the correct checkboxes in the modal from the list of claims', async () => {
    render(
      <TravelPayClaimsFilter
        claims={claims}
        totalClaims={claims.length}
        filter={new Set()}
        onFilterChanged={jest.fn()}
        sortBy={SortOption.Recent}
        onSortByChanged={jest.fn()}
      />,
    )

    await waitFor(() => {
      fireEvent.press(screen.getByTestId('travelClaimsFilterModalButtonTestId'))
    })

    // Modal is appearing after the button press
    await waitFor(() => {
      expect(screen.getByTestId(`checkbox_${FILTER_KEY_ALL}`)).toBeTruthy()
    })

    expect(screen.getByTestId('checkbox_Claim submitted')).toBeTruthy()
    expect(screen.getByTestId('checkbox_Saved')).toBeTruthy()
    expect(screen.getByTestId('checkbox_In process')).toBeTruthy()
    expect(screen.getAllByTestId('checkbox_label_', { exact: false })).toHaveLength(4)
  })
})
