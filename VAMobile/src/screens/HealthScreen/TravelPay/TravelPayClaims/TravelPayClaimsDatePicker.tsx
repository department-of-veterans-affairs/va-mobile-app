import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, VAModalPicker } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { TimeFrameType } from 'constants/timeframes'
import { getPickerOptions } from 'utils/dateUtils'
import { useTheme } from 'utils/hooks'

type TravelPayClaimsDatePickerProps = {
  timeFrame: TimeFrameType
  onTimeFrameChanged: (value: TimeFrameType) => void
}

function TravelPayClaimsDatePicker({ timeFrame, onTimeFrameChanged }: TravelPayClaimsDatePickerProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const pickerOptions = getPickerOptions(t, {
    dateRangeA11yLabelTKey: 'travelPay.statusList.dateRangeA11yLabel',
    allOfTKey: 'travelPay.statusList.allOf',
    pastThreeMonthsTKey: 'travelPay.statusList.dateRange.pastThreeMonths',
  }).map((option) => ({
    ...option,
    testID: undefined, // We must pass undefined here to prevent the testID from being set to the a11y value and confusing screen readers
  }))

  const [datePickerOption, setDatePickerOption] = useState(
    pickerOptions.find((option) => option.value === timeFrame) ?? pickerOptions[0],
  )

  return (
    <Box mx={theme.dimensions.gutter} accessible={true}>
      <VAModalPicker
        selectedValue={datePickerOption.value}
        onSelectionChange={(value) => {
          const found = pickerOptions.find((option) => option.value === value)
          if (found) {
            setDatePickerOption(found)
            onTimeFrameChanged(found.value)
          }
        }}
        pickerOptions={pickerOptions}
        labelKey={'travelPay.statusList.selectADateRange'}
        testID="getDateRangeTestID"
      />
    </Box>
  )
}

export default TravelPayClaimsDatePicker
