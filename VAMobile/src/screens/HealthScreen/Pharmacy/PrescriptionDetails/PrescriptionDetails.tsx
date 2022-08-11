import { DateTime } from 'luxon'
import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, TextArea, TextView, VAScrollView } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionState } from 'store/slices/prescriptionSlice'
import { RefillTag } from '../PrescriptionCommon'
import { RootState } from 'store'
import { useTheme } from 'utils/hooks'
import DetailsTextSections from './DetailsTextSections'

type PrescriptionDetailsProps = StackScreenProps<HealthStackParamList, 'PrescriptionDetails'>

const PrescriptionDetails: FC<PrescriptionDetailsProps> = ({ route }) => {
  const { prescriptionId } = route.params
  const { prescriptionsById } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const { t: th } = useTranslation(NAMESPACE.HOME)
  const noneNoted = tc('noneNoted')

  const { contentMarginTop, standardMarginBetween, contentMarginBottom } = theme.dimensions

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

  const lastRefilledDateFormatted = getDate(refillDate)
  const expireDateFormatted = getDate(expirationDate)
  const dateOrderedFormatted = getDate(orderedDate)

  return (
    <VAScrollView>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        <TextArea>
          <RefillTag status={refillStatus} />
          <TextView variant="BitterBoldHeading" mt={standardMarginBetween}>
            {prescriptionName}
          </TextView>
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
          <DetailsTextSections
            leftSectionTitle={t('prescription.details.rxNumberHeader')}
            leftSectionValue={prescriptionNumber || noneNoted}
            leftSectionValueLabel={prescriptionNumber ? prescriptionNumber.split('').join(' ') : noneNoted}
          />
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionDetails
