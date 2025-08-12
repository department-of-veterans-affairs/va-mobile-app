import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import TravelPayClaimsFilter from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilter'
import { context, render } from 'testUtils'

context('TravelPayClaimsFilter', () => {
  const initializeTestInstance = () => {
    render(
      <TravelPayClaimsFilter
        totalClaims={1}
        selectedFilter=""
        setSelectedFilter={() => {}}
        selectedSortBy=""
        setSelectedSortBy={() => {}}
      />,
    )
  }

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByTestId('getDateRangeTestID')).toBeTruthy()
    expect(screen.getByRole('header')).toBeTruthy()
    expect(screen.getByTestId('openFilterAndSortTestID')).toBeTruthy()
    expect(screen.getByText(t('filterAndSort'))).toBeTruthy()
    expect(screen.getByTestId('clearFiltersButton')).toBeTruthy()
    expect(screen.getByText(t('travelPay.statusList.clearFilters'))).toBeTruthy()
  })

  describe('travel claims list title', () => {
    it('should display formatted title using translation', () => {
      initializeTestInstance()
      expect(
        screen.getByText(
          t('travelPay.statusList.list.title', {
            count: 15,
            filter: 'All',
            sort: 'most recent',
          }),
        ),
      ).toBeTruthy()
    })
  })

  describe('when clear filters button is pressed', () => {
    it('should call console.log', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      initializeTestInstance()

      const clearFiltersButton = screen.getByTestId('clearFiltersButton')
      fireEvent.press(clearFiltersButton)

      expect(consoleSpy).toHaveBeenCalledWith('Clear filters pressed')
      consoleSpy.mockRestore()
    })
  })

  describe('accessibility', () => {
    it('should have proper accessibility properties for clear filters button', () => {
      initializeTestInstance()
      const clearFiltersButton = screen.getByTestId('clearFiltersButton')

      expect(clearFiltersButton).toBeTruthy()
      expect(clearFiltersButton.props.accessibilityRole).toBe('button')
      expect(clearFiltersButton.props.accessibilityLabel).toBe(t('travelPay.statusList.clearFilters'))
      expect(clearFiltersButton.props.accessibilityHint).toBe(t('travelPay.statusList.clearFilters.a11yHint'))
    })
  })
})
