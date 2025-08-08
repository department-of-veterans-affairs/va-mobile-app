import React from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { DateTime } from 'luxon'

import { Box, BoxProps, TextView, VAModalPicker } from 'components'
import RadioGroupModal, { RadioGroupModalProps } from 'components/RadioGroupModal'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type TravelClaimsDatePickerValue = {
  startDate: DateTime
  endDate: DateTime
}

type TravelClaimsDatePickerOption = {
  label: string
  value: string
  a11yLabel: string
  dates: TravelClaimsDatePickerValue
}

export const TravelPayClaimsFilter = () => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  // TODO - need to replace with actual data from props or state
  const travelClaimsCount = 15
  const currentFilter = 'All'
  const currentSort = 'most recent'

  const travelClaimsListTitle = () => {
    const keys = {
      count: travelClaimsCount,
      filter: currentFilter,
      sort: currentSort,
    }

    return t('travelPay.statusList.list.title', keys)
  }

  const getPickerOptions = (): Array<TravelClaimsDatePickerOption> => {
    const todaysDate = DateTime.local()
    const threeMonthsEarlier = todaysDate.minus({ months: 3 })

    return [
      {
        label: t('travelPay.statusList.pastThreeMonths'),
        value: t('travelPay.statusList.pastThreeMonths'),
        a11yLabel: t('travelPay.statusList.pastThreeMonths'),
        dates: { startDate: threeMonthsEarlier.startOf('day'), endDate: todaysDate.endOf('day') },
      },
    ]
  }

  const pickerOptions = getPickerOptions()
  const [datePickerOption, setDatePickerOption] = useState(pickerOptions[0])

  // TODO- add filter and sort state
  const [selectedFilter, setSelectedFilter] = useState('')
  const [selectedSortBy, setSelectedSortBy] = useState('')

  const setValuesOnPickerSelect = (selectValue: string): void => {
    const curSelectedRange = pickerOptions.find((el) => el.value === selectValue)
    if (curSelectedRange) {
      setDatePickerOption(curSelectedRange)
    }
  }

  // TODO- add modal props
  const modalProps: RadioGroupModalProps = {
    groups: [
      {
        items: [
          { optionLabelKey: 'All', value: 'all' },
          { optionLabelKey: 'Paid', value: 'paid' },
          { optionLabelKey: 'Denied', value: 'denied' },
        ],
        onSetOption: (newFilter: string) => {
          setSelectedFilter(newFilter)
        },
        selectedValue: selectedFilter,
        title: 'Filter by',
      },
      {
        items: [
          { optionLabelKey: 'Most recent', value: 'recent' },
          { optionLabelKey: 'Oldest', value: 'oldest' },
        ],
        onSetOption: (newSortBy: string) => {
          setSelectedSortBy(newSortBy)
        },
        selectedValue: selectedSortBy,
        title: 'Sort by',
      },
    ],
    buttonText: t('filterAndSort'),
    buttonA11yLabel: t('filterAndSort'),
    buttonTestID: 'openFilterAndSortTestID',
    headerText: t('filterAndSort'),
    onApply: () => {
      // TODO- add apply logic
      console.log('Apply filters:', selectedFilter, selectedSortBy)
    },
    onCancel: () => {
      // TODO- add cancel logic
      console.log('Cancel filters')
    },
    testID: 'TravelPayFilterModalTestID',
  }

  const filterContainerProps: BoxProps = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    mx: theme.dimensions.gutter,
    mb: theme.dimensions.standardMarginBetween,
  }

  const onClearFiltersPress = () => {
    // TODO- add clear filters functionality
    console.log('Clear filters pressed')
  }

  const filterModal = () => {
    return (
      <Box {...filterContainerProps}>
        <Box mr={8} mb={10}>
          <RadioGroupModal {...modalProps} />
        </Box>
        <TextView
          onPress={onClearFiltersPress}
          accessibilityRole="button"
          accessibilityLabel={t('travelPay.statusList.clearFilters')}
          accessibilityHint="Clears all applied filters and sorting options"
          color="link"
          testID="clearFiltersButton">
          {t('travelPay.statusList.clearFilters')}
        </TextView>
      </Box>
    )
  }

  return (
    <Box>
      <Box mx={theme.dimensions.gutter} accessible={true}>
        <VAModalPicker
          selectedValue={datePickerOption.value}
          onSelectionChange={setValuesOnPickerSelect}
          pickerOptions={pickerOptions}
          labelKey={'travelPay.statusList.selectADateRange'}
          testID="getDateRangeTestID"
        />
        <TextView
          mt={theme.dimensions.condensedMarginBetween}
          mb={theme.dimensions.condensedMarginBetween}
          accessibilityRole="header"
          variant={'MobileBodyBold'}>
          {travelClaimsListTitle()}
        </TextView>
      </Box>
      {/* Filter and Sort Section */}
      {filterModal()}
    </Box>
  )
}
