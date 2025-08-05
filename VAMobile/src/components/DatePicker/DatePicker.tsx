import React, { FC, ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'

import { Button, ButtonVariants } from '@department-of-veterans-affairs/mobile-component-library'
import { TFunction } from 'i18next'

import { BorderColorVariant, Box, TextView } from 'components'
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

const DatePicker: FC<DatePickerProps> = ({ labelKey }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const [showCal, setShowCal] = useState(false)

  return (
    <Box mx={theme.dimensions.gutter}>
      {labelKey ? renderInputLabelSection(labelKey, t) : <></>}
      <Box
        px={theme.dimensions.smallMarginBetween}
        borderRadius={8}
        backgroundColor={'list'}
        borderStyle="solid"
        borderColor="primary">
        <Box py={theme.dimensions.standardMarginBetween} flex={1} flexDirection="row" justifyContent="space-between">
          <TextView>From</TextView>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setShowCal(!showCal)
            }}>
            <TextView color={'link'}>April 18, 2025</TextView>
          </Pressable>
        </Box>
        {showCal ? (
          <Box>
            <TextView>Calendar stuff</TextView>
          </Box>
        ) : (
          <></>
        )}
        <></>
        <Box
          my={theme.dimensions.condensedMarginBetween}
          borderBottomWidth={1}
          borderColor={theme.colors.border.aboutYou as BorderColorVariant}
        />
        <Box py={theme.dimensions.standardMarginBetween} flex={1} flexDirection="row" justifyContent="space-between">
          <TextView>To</TextView>
          <Box>
            <TextView color={'link'}>July 18, 2025</TextView>
          </Box>
        </Box>
      </Box>
      <Box pt={theme.dimensions.standardMarginBetween}>
        <Button onPress={() => {}} label={t('apply')} buttonType={ButtonVariants.Primary} />
      </Box>
    </Box>
  )
}

export default DatePicker
