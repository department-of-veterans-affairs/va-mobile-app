import React from 'react'

import { fireEvent, screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { SortOption } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilter'
import { CheckboxOption } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilterCheckboxGroup'
import TravelPayClaimsFilterModal from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilterModal'
import { context, render } from 'testUtils'
import { FILTER_KEY_ALL } from 'utils/travelPay'

const mockSetCurrentFilter = jest.fn()
const mockSetCurrentSortBy = jest.fn()

const FILTER_OPTIONS: Array<CheckboxOption> = [
  { optionLabelKey: 'Option 1', value: 'option_1' },
  { optionLabelKey: 'Option 2', value: 'option_2' },
  { optionLabelKey: 'Option 3', value: 'option_3' },
]

context('TravelPayClaimsFilterModal', () => {
  const initialFilter = new Set('Claim submitted')
  const initialSortBy = SortOption.Recent

  beforeEach(() => {
    mockSetCurrentFilter.mockClear()
    mockSetCurrentSortBy.mockClear()
  })

  const initializeTestInstance = (options = FILTER_OPTIONS) => {
    render(
      <TravelPayClaimsFilterModal
        totalClaims={4}
        options={options}
        currentFilter={initialFilter}
        setCurrentFilter={mockSetCurrentFilter}
        currentSortBy={initialSortBy}
        setCurrentSortBy={mockSetCurrentSortBy}
      />,
    )
  }

  it('renders the button to show the modal', () => {
    initializeTestInstance()

    expect(screen.getByTestId('travelClaimsFilterModalButtonTestId')).toBeTruthy()
  })

  it('renders modal elements as well as the correct filter and sort options', async () => {
    initializeTestInstance()
    fireEvent.press(screen.getByTestId('travelClaimsFilterModalButtonTestId'))

    await waitFor(() => {
      expect(screen.getByText(t('travelPay.statusList.sortBy'))).toBeTruthy()

      expect(screen.getByTestId('filterButtonApplyTestID')).toBeTruthy()
      expect(screen.getByTestId('filterButtonCancelTestID')).toBeTruthy()
      expect(screen.getByTestId('filterAndSortModalTitle')).toBeTruthy()

      expect(screen.getByTestId(`checkbox_${FILTER_KEY_ALL}`)).toBeTruthy()
      expect(screen.getByTestId('checkbox_option_1')).toBeTruthy()
      expect(screen.getByTestId('checkbox_option_3')).toBeTruthy()

      expect(screen.getByText(t('travelPay.statusList.sortOption.recent'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.statusList.sortOption.oldest'))).toBeTruthy()
    })
  })

  it('applies the filter and sort when the apply button is pressed', async () => {
    initializeTestInstance()
    fireEvent.press(screen.getByTestId('travelClaimsFilterModalButtonTestId'))

    await waitFor(() => expect(screen.getByTestId('filterButtonApplyTestID')).toBeTruthy())
    fireEvent.press(screen.getByTestId('filterButtonApplyTestID'))

    expect(mockSetCurrentFilter).toHaveBeenCalled()
    expect(mockSetCurrentSortBy).toHaveBeenCalled()
  })

  it('hides the modal when cancel is pressed', async () => {
    initializeTestInstance()
    fireEvent.press(screen.getByTestId('travelClaimsFilterModalButtonTestId'))
    expect(screen.getByTestId('claimsFilterModal')).toBeTruthy()

    fireEvent.press(screen.getByTestId('filterButtonCancelTestID'))
    await waitFor(() => expect(screen.queryByTestId('claimsFilterModal')).toBeNull())
  })
})
