import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionHistoryTabConstants, PrescriptionHistoryTabs } from 'store/api/types'
import { ViewStyle } from 'react-native'
import { a11yLabelVA } from 'utils/a11yLabel'
import { useTheme } from 'utils/hooks'

type PrescriptionHistoryNoMatchesProps = {
  /** currently selected tab */
  currentTab: PrescriptionHistoryTabs
  /** whether a filter has been applied to the results */
  isFiltered: boolean
}

const PrescriptionHistoryNoMatches: FC<PrescriptionHistoryNoMatchesProps> = ({ currentTab, isFiltered }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const getFilteredTabString = () => {
    switch (currentTab) {
      case PrescriptionHistoryTabConstants.ALL:
        return t('prescription.history.empty.filtered.all')
      case PrescriptionHistoryTabConstants.PENDING:
        return t('prescription.history.empty.filtered.pending')
      case PrescriptionHistoryTabConstants.TRACKING:
        return t('prescription.history.empty.filtered.tracking')
    }
  }

  const getFilteredNoMatch = () => {
    let contenta11y = {}
    if (currentTab === PrescriptionHistoryTabConstants.ALL) {
      contenta11y = { accessibilityLabel: a11yLabelVA(t('prescription.history.empty.filtered.all')) }
    }
    return (
      <>
        <TextView textAlign={'center'} variant="MobileBodyBold">
          {t('prescription.history.empty.filtered.title')}
        </TextView>
        <TextView pt={theme.dimensions.condensedMarginBetween} textAlign={'center'} variant="MobileBody" {...contenta11y}>
          {getFilteredTabString()}
        </TextView>
      </>
    )
  }

  const getContent = () => {
    if (isFiltered) {
      return getFilteredNoMatch()
    }

    switch (currentTab) {
      case PrescriptionHistoryTabConstants.ALL:
        return (
          <>
            <TextView textAlign={'center'} variant="MobileBodyBold">
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
      case PrescriptionHistoryTabConstants.PENDING:
        return (
          <>
            <TextView textAlign={'center'} variant="MobileBodyBold">
              {t('prescription.history.empty.pending.title')}
            </TextView>
            <TextView
              pt={theme.dimensions.condensedMarginBetween}
              textAlign={'center'}
              variant="MobileBody"
              accessibilityLabel={a11yLabelVA(t('prescription.history.empty.pending.message'))}>
              {t('prescription.history.empty.pending.message')}
            </TextView>
          </>
        )
      case PrescriptionHistoryTabConstants.TRACKING:
        return (
          <>
            <TextView textAlign={'center'} variant="MobileBodyBold">
              {t('prescription.history.empty.tracking.title')}
            </TextView>
            <TextView pt={theme.dimensions.condensedMarginBetween} textAlign={'center'} variant="MobileBody">
              {t('prescription.history.empty.tracking.p1')}
            </TextView>
            <TextView
              pt={theme.dimensions.condensedMarginBetween}
              textAlign={'center'}
              variant="MobileBody"
              accessibilityLabel={a11yLabelVA(t('prescription.history.empty.tracking.p2'))}>
              {t('prescription.history.empty.tracking.p2')}
            </TextView>
          </>
        )
    }
  }

  const noMatchScrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  return (
    <VAScrollView contentContainerStyle={noMatchScrollStyles}>
      <Box justifyContent="center" mx={theme.dimensions.gutter} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
        <Box mt={theme.dimensions.condensedMarginBetween}>{getContent()}</Box>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionHistoryNoMatches
