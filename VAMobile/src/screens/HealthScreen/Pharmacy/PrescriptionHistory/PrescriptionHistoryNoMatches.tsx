import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useTheme } from 'utils/hooks'

type PrescriptionHistoryNoMatchesProps = {
  /** whether a filter has been applied to the results */
  isFiltered: boolean
}

function PrescriptionHistoryNoMatches({ isFiltered }: PrescriptionHistoryNoMatchesProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const getFilteredNoMatch = () => {
    const contenta11y = { accessibilityLabel: a11yLabelVA(t('prescription.history.empty.filtered.message')) }
    return (
      <>
        <TextView textAlign={'center'} variant="MobileBodyBold" accessibilityRole={'header'}>
          {t('prescription.history.empty.filtered.title')}
        </TextView>
        <TextView
          pt={theme.dimensions.condensedMarginBetween}
          textAlign={'center'}
          variant="MobileBody"
          {...contenta11y}>
          {t('prescription.history.empty.filtered.message')}
        </TextView>
      </>
    )
  }

  const getContent = () => {
    if (isFiltered) {
      return getFilteredNoMatch()
    }

    return (
      <>
        <TextView textAlign={'center'} variant="MobileBodyBold" accessibilityRole={'header'}>
          {t('prescription.history.empty.title')}
        </TextView>
        <TextView
          pt={theme.dimensions.condensedMarginBetween}
          textAlign={'center'}
          variant="MobileBody"
          accessibilityLabel={a11yLabelVA(t('prescription.history.empty.message'))}>
          {t('prescription.history.empty.message')}
        </TextView>
      </>
    )
  }

  const noMatchScrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  return (
    <VAScrollView contentContainerStyle={noMatchScrollStyles}>
      <Box
        justifyContent="center"
        mx={theme.dimensions.gutter}
        mb={theme.dimensions.contentMarginBottom}
        alignItems={'center'}>
        <Box mt={theme.dimensions.condensedMarginBetween}>{getContent()}</Box>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionHistoryNoMatches
