import { DateTime } from 'luxon'
import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickToCallPhoneNumber, FooterButton, FooterButtonProps, LoadingComponent, TextArea, TextView, VAScrollView } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionState, loadAllPrescriptions, requestRefills } from 'store/slices/prescriptionSlice'
import { RefillStatusConstants, ScreenIDTypesConstants } from 'store/api/types'
import { RefillTag } from '../PrescriptionCommon'
import { RootState } from 'store'
import { useAppDispatch, useDestructiveAlert, useExternalLink, useTheme } from 'utils/hooks'
import { useFocusEffect } from '@react-navigation/native'
import DetailsTextSections from './DetailsTextSections'
import PrescriptionsDetailsBanner from './PrescriptionsDetailsBanner'
import getEnv from 'utils/env'

type PrescriptionDetailsProps = StackScreenProps<HealthStackParamList, 'PrescriptionDetails'>

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

const PrescriptionDetails: FC<PrescriptionDetailsProps> = ({ route, navigation }) => {
  const { prescriptionId } = route.params
  const { loadingHistory, prescriptionsById, prescriptionsNeedLoad } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)
  const theme = useTheme()
  const launchExternalLink = useExternalLink()
  const submitRefillAlert = useDestructiveAlert()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const noneNoted = tc('noneNoted')

  const { contentMarginTop, contentMarginBottom } = theme.dimensions

  const prescription = prescriptionsById[prescriptionId]
  const { refillStatus, prescriptionName, isRefillable, instructions, refillRemaining, refillDate, quantity, facilityName, prescriptionNumber, expirationDate, orderedDate } =
    prescription?.attributes

  // useFocusEffect, ensures we only call loadAllPrescriptions if needed when this component is being shown
  useFocusEffect(
    React.useCallback(() => {
      if (prescriptionsNeedLoad) {
        dispatch(loadAllPrescriptions(ScreenIDTypesConstants.PRESCRIPTION_TRACKING_DETAILS_SCREEN_ID))
      }
    }, [dispatch, prescriptionsNeedLoad]),
  )

  const getDate = (date?: string | null) => {
    return date ? DateTime.fromISO(date).toUTC().toFormat('MM/dd/yyyy') : noneNoted
  }

  const redirectLink = (): void => {
    launchExternalLink(LINK_URL_GO_TO_PATIENT_PORTAL)
  }

  const getFooterButton = () => {
    if (refillStatus === RefillStatusConstants.TRANSFERRED) {
      return getGoToMyVAHealthButton()
    } else if (isRefillable) {
      return getRequestRefillButton()
    }

    return <></>
  }
  const getGoToMyVAHealthButton = () => {
    const footerButtonProps: FooterButtonProps = {
      text: tc('goToMyVAHealth'),
      testID: tc('goToMyVAHealth.a11yLabel'),
      backGroundColor: 'buttonPrimary',
      textColor: 'navBar',
      onPress: redirectLink,
      iconProps: {
        name: 'WebviewOpen',
        height: 15,
        width: 15,
        fill: 'navBar',
        preventScaling: true,
      },
    }
    return <FooterButton {...footerButtonProps} />
  }

  const getRequestRefillButton = () => {
    const requestRefillButtonProps: FooterButtonProps = {
      text: t('prescriptions.refill.RequestRefillButtonTitle', { count: 0 }),
      backGroundColor: 'buttonPrimary',
      textColor: 'navBar',
      onPress: () => {
        submitRefillAlert({
          title: t('prescriptions.refill.confirmationTitle', { count: 0 }),
          cancelButtonIndex: 0,
          buttons: [
            {
              text: tc('cancel'),
            },
            {
              text: t('prescriptions.refill.RequestRefillButtonTitle', { count: 0 }),
              onPress: () => {
                // Call refill request so its starts the loading screen and then go to the modal
                dispatch(requestRefills([prescription]))
                navigation.navigate('RefillScreenModal')
              },
            },
          ],
        })
      },
    }
    return <FooterButton {...requestRefillButtonProps} />
  }

  const getBanner = () => {
    if (refillStatus !== RefillStatusConstants.TRANSFERRED) {
      return <></>
    }

    return <PrescriptionsDetailsBanner />
  }

  const lastRefilledDateFormatted = getDate(refillDate)
  const expireDateFormatted = getDate(expirationDate)
  const dateOrderedFormatted = getDate(orderedDate)

  if (loadingHistory) {
    return <LoadingComponent text={t('prescription.details.loading')} />
  }

  return (
    <>
      <VAScrollView>
        {getBanner()}
        <Box mt={contentMarginTop} mb={contentMarginBottom}>
          <RefillTag status={refillStatus} />
          <TextArea noBorder={true}>
            <TextView variant="BitterBoldHeading">{prescriptionName}</TextView>
            <TextView
              color={'placeholder'}
              accessibilityLabel={prescriptionNumber ? `${t('prescription.prescriptionNumber.a11yLabel')} ${prescriptionNumber.split('').join(' ')}` : noneNoted}>{`${t(
              'prescription.prescriptionNumber',
            )} ${prescriptionNumber || noneNoted}`}</TextView>
            <DetailsTextSections leftSectionTitle={t('prescription.details.instructionsHeader')} leftSectionValue={instructions || noneNoted} />
            <DetailsTextSections
              leftSectionTitle={t('prescription.details.refillLeftHeader')}
              leftSectionValue={refillRemaining ?? noneNoted}
              rightSectionTitle={t('prescription.details.lastFillDateHeader')}
              rightSectionValue={lastRefilledDateFormatted}
            />
            <DetailsTextSections leftSectionTitle={t('prescription.details.quantityHeader')} leftSectionValue={quantity ?? noneNoted} />
            <DetailsTextSections
              leftSectionTitle={t('prescription.details.expiresOnHeader')}
              leftSectionValue={expireDateFormatted}
              rightSectionTitle={t('prescription.details.orderedOnHeader')}
              rightSectionValue={dateOrderedFormatted}
            />
            <DetailsTextSections
              leftSectionTitle={t('prescription.details.vaFacilityHeader')}
              leftSectionValue={facilityName || noneNoted}
              leftSectionTitleLabel={t('prescription.details.vaFacilityHeaderLabel')}>
              <ClickToCallPhoneNumber phone={tc('8773270022')} displayedText={tc('8773270022.displayText')} />
            </DetailsTextSections>
          </TextArea>
        </Box>
      </VAScrollView>
      {getFooterButton()}
    </>
  )
}

export default PrescriptionDetails
