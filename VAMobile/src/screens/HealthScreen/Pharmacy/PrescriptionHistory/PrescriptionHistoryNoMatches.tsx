import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionHistoryTabConstants, PrescriptionHistoryTabs } from 'store/api'
import { ViewStyle } from 'react-native'
import { useTheme } from 'utils/hooks'

type PrescriptionHistoryNoMatchesProps = {
  currentTab: PrescriptionHistoryTabs
}

const PrescriptionHistoryNoMatches: FC<PrescriptionHistoryNoMatchesProps> = ({ currentTab }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()

  const getContent = () => {
    switch (currentTab) {
      case PrescriptionHistoryTabConstants.ALL:
        return (
          <>
            <TextView textAlign={'center'} variant="MobileBodyBold">
              {t('prescription.history.empty.title')}
            </TextView>
            <TextView pt={theme.dimensions.condensedMarginBetween} textAlign={'center'} variant="MobileBody" accessibilityLabel={t('prescription.history.empty.message.a11y')}>
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
              accessibilityLabel={t('prescription.history.empty.pending.message.a11y')}>
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
            <TextView pt={theme.dimensions.condensedMarginBetween} textAlign={'center'} variant="MobileBody" accessibilityLabel={t('prescription.history.empty.tracking.p2.a11y')}>
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
      <Box justifyContent="center" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
        <Box mt={theme.dimensions.condensedMarginBetween}>{getContent()}</Box>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionHistoryNoMatches
