import { DateTime } from 'luxon'
import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickForActionLink, FooterButton, LinkButtonProps, LinkTypeOptionsConstants, TextArea, TextView, VAScrollView } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionState } from 'store/slices/prescriptionSlice'
import { RefillStatusConstants } from 'store/api/types'
import { RefillTag } from '../PrescriptionCommon'
import { RootState } from 'store'
import { useExternalLink, useTheme } from 'utils/hooks'
import DetailsTextSections from './DetailsTextSections'
import PrescriptionsDetailsBanner from './PrescriptionsDetailsBanner'
import getEnv from 'utils/env'

type PrescriptionDetailsProps = StackScreenProps<HealthStackParamList, 'PrescriptionDetails'>

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

const PrescriptionDetails: FC<PrescriptionDetailsProps> = ({ route }) => {
  const { prescriptionId } = route.params
  const { prescriptionsById } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)
  const theme = useTheme()
  const launchExternalLink = useExternalLink()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const { t: th } = useTranslation(NAMESPACE.HOME)
  const noneNoted = tc('noneNoted')

  const { contentMarginTop, contentMarginBottom } = theme.dimensions

  const { refillStatus, prescriptionName, instructions, refillRemaining, refillDate, quantity, facilityName, prescriptionNumber, expirationDate, orderedDate } =
    prescriptionsById[prescriptionId]?.attributes

  const getDate = (date?: string | null) => {
    return date ? DateTime.fromISO(date).toUTC().toFormat('MM/dd/yyyy') : noneNoted
  }

  const clickToCallProps: LinkButtonProps = {
    displayedText: tc('8773270022.displayText'),
    numberOrUrlLink: tc('8773270022'),
    linkType: LinkTypeOptionsConstants.call,
  }

  const ttyProps: LinkButtonProps = {
    displayedText: th('contactVA.tty.displayText'),
    linkType: LinkTypeOptionsConstants.callTTY,
    numberOrUrlLink: th('contactVA.tty.number'),
    accessibilityLabel: th('contactVA.tty.number.a11yLabel'),
  }

  const redirectLink = (): void => {
    launchExternalLink(LINK_URL_GO_TO_PATIENT_PORTAL)
  }

  const getFooter = () => {
    if (refillStatus !== RefillStatusConstants.TRANSFERRED) {
      return <></>
    }

    return <FooterButton text={tc('goToMyVAHealth')} testID={tc('goToMyVAHealth.a11yLabel')} backGroundColor="buttonPrimary" textColor={'navBar'} onPress={redirectLink} />
  }

  const lastRefilledDateFormatted = getDate(refillDate)
  const expireDateFormatted = getDate(expirationDate)
  const dateOrderedFormatted = getDate(orderedDate)

  return (
    <>
      <VAScrollView>
        <PrescriptionsDetailsBanner status={refillStatus} />
        <Box mt={contentMarginTop} mb={contentMarginBottom}>
          <RefillTag status={refillStatus} />
          <TextArea noBorder={true}>
            <TextView variant="BitterBoldHeading">{prescriptionName}</TextView>
            <TextView color={'placeholder'} accessibilityLabel={prescriptionNumber ? prescriptionNumber.split('').join(' ') : noneNoted}>{`${t(
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
              <ClickForActionLink {...clickToCallProps} />
              <ClickForActionLink {...ttyProps} />
            </DetailsTextSections>
          </TextArea>
        </Box>
      </VAScrollView>
      {getFooter()}
    </>
  )
}

export default PrescriptionDetails
