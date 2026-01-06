import React, { useMemo } from 'react'
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
    value: option.label,
    timeFrame: option.value as TimeFrameType,
    testID: option.a11yLabel,
  }))

  const datePickerOption = useMemo(
    () => pickerOptions.find((option) => option.timeFrame === timeFrame) ?? pickerOptions[0],
    [pickerOptions, timeFrame],
  )

  return (
    <Box mx={theme.dimensions.gutter} accessible={true}>
      <VAModalPicker
        selectedValue={datePickerOption.value}
        onSelectionChange={(value) => {
          const found = pickerOptions.find((option) => option.value === value)
          if (found) {
            onTimeFrameChanged(found.timeFrame)
          }
        }}
        pickerOptions={pickerOptions}
        labelKey={'travelPay.statusList.selectADateRange'}
        testID="getDateRangeTestID"
        confirmTestID="confirmDateRangeTestId"
      />
    </Box>
  )
}

export default TravelPayClaimsDatePicker
