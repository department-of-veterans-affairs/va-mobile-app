import React, { FC, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import { TFunction } from 'i18next'
import { DateTime } from 'luxon'

import { BorderColorVariant, Box, TextView } from 'components'
import DatePickerField from 'components/DatePicker/DatePickerField'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

export type DatePickerProps = {
  /** i18n key for the text label next the picker field */
  labelKey?: string
}

export const renderInputLabelSection = (labelKey: string, t: TFunction): ReactElement => {
  const variant = 'MobileBody'
  return (
    <Box>
      <Box display="flex" flexDirection="row" flexWrap="wrap" mb={8}>
        <TextView variant={variant}>{t(labelKey)}</TextView>
      </Box>
    </Box>
  )
}

const initialDate = DateTime.local()

const DatePicker: FC<DatePickerProps> = ({ labelKey }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [startDate] = useState(initialDate.minus({ months: 5 }).startOf('day'))
  const [endDate] = useState(initialDate.minus({ months: 3 }).endOf('day'))

  return (
    <Box mx={theme.dimensions.gutter}>
      {labelKey ? renderInputLabelSection(labelKey, t) : <></>}
      <Box
        px={theme.dimensions.smallMarginBetween}
        borderRadius={8}
        backgroundColor={'list'}
        borderStyle="solid"
        borderColor="primary">
        <DatePickerField label="From" date={startDate} />
        <Box
          my={theme.dimensions.condensedMarginBetween}
          borderBottomWidth={1}
          borderColor={theme.colors.border.aboutYou as BorderColorVariant}
        />
        <DatePickerField label="To" date={endDate} />
      </Box>
      <Box pt={theme.dimensions.standardMarginBetween}>
        <Button onPress={() => {}} label={t('apply')} buttonType={ButtonVariants.Primary} />
      </Box>
    </Box>
  )
}

export default DatePicker
