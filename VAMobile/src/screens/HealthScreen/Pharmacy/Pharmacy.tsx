import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, ButtonWithIcon, LoadingComponent, TextArea, TextView, TrackingCard, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionState, getRefillablePrescriptions } from 'store/slices/prescriptionSlice'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

const Pharmacy: FC = ({}) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()

  const { refillableCount, loadingRefillable, needsRefillableLoaded } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)

  useEffect(() => {
    // may need to reload if we submitted some refills
    if (needsRefillableLoaded) {
      dispatch(getRefillablePrescriptions(ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID))
    }
  }, [dispatch, needsRefillableLoaded])

  if (loadingRefillable) {
    return <LoadingComponent text={t('prescriptions.loading')} />
  }

  const condensedMarginBetween = theme.dimensions.condensedMarginBetween

  const renderPharmacyTools = () => {
    return (
      <Box mt={40}>
        <TextView variant="MobileBodyBold">{t('pharmacy.tools')}</TextView>
        <Box my={condensedMarginBetween}>
          <ButtonWithIcon
            onPress={navigateTo('PrescriptionHistory')}
            buttonText={t('pharmacy.tools.myMedicationsList')}
            iconName="ListSolid"
            a11yHint={t('pharmacy.tools.myMedicationsList.a11yHint')}
          />
        </Box>
        <Box mb={condensedMarginBetween}>
          <ButtonWithIcon onPress={() => {}} buttonText={t('pharmacy.tools.renewalRequest')} iconName="CommentSolid" a11yHint={t('pharmacy.tools.renewalRequest.a11yHint')} />
        </Box>
      </Box>
    )
  }

  const renderPrescriptionTracking = () => {
    const trackingCardCommonProps = {
      onPress: () => {},
      dateShipped: '01/01/2022',
    }

    return (
      <Box mt={47}>
        <Box mb={17} flexDirection="row" flexWrap="wrap" justifyContent="space-between">
          <TextView variant="MobileBodyBold">{t('pharmacy.prescriptionTracking')}</TextView>
          <TextView variant="HelperTextBold" color="showAll" accessibilityRole="button" onPress={() => {}}>
            {t('pharmacy.prescriptionTracking.showAll')}
          </TextView>
        </Box>
        <Box>
          <Box mb={condensedMarginBetween}>
            <TrackingCard title={'Acetaminophen 25MG TAB'} {...trackingCardCommonProps} />
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <VAScrollView>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBodyBold" mb={condensedMarginBetween}>
            {t('pharmacy.textArea.title')}
          </TextView>
          <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
            {t('pharmacy.textArea.prescriptionRefill', { count: refillableCount })}
          </TextView>
          <VAButton onPress={navigateTo('RefillScreenModal')} label={t('pharmacy.textArea.button', { count: 1 })} buttonType="brandedPrimary" />
        </TextArea>
        <Box mt={condensedMarginBetween} mx={theme.dimensions.gutter}>
          <TextView variant="HelperText">
            {t('pharmacy.request10days.1') + ' '}
            <TextView variant="HelperTextBold">{t('pharmacy.request10days.2')}</TextView>
            {' ' + t('pharmacy.request10days.3')}
          </TextView>
          {renderPharmacyTools()}
          {renderPrescriptionTracking()}
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default Pharmacy
