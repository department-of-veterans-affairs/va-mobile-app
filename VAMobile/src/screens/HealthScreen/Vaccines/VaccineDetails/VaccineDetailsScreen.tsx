import { StackScreenProps } from '@react-navigation/stack'
import { each, map } from 'underscore'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, TextArea, TextView, VAScrollView } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { StoreState, VaccineState } from 'store/reducers'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type VaccineDetailsScreenProps = StackScreenProps<HealthStackParamList, 'VaccineDetails'>

/**
 * Screen providing details on an vaccine
 */
const VaccineDetailsScreen: FC<VaccineDetailsScreenProps> = ({ route }) => {
  const { vaccineId } = route.params
  const { vaccinesById } = useSelector<StoreState, VaccineState>((state) => state.vaccine)
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const { contentMarginBottom, contentMarginTop, standardMarginBetween } = theme.dimensions

  const vaccine = vaccinesById[vaccineId]

  const addressLines = map(vaccine.location.address.line || [], (line, idx) => {
    return (
      <TextView variant={'MobileBody'} key={idx}>
        {line}
      </TextView>
    )
  })

  const notes = map(vaccine.notes || [], (note, idx) => {
    return (
      <TextView variant={'MobileBody'} key={idx}>
        {note.text}
      </TextView>
    )
  })

  let reactionListStr = ''
  each(vaccine.reaction, (reaction) => {
    reactionListStr = `${reactionListStr} ${reaction.detail.display}`
  })

  return (
    <VAScrollView {...testIdProps('Vaccine-details-page')}>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        <TextArea>
          <TextView color="primary" variant="MobileBody" mb={standardMarginBetween}>
            {formatDateMMMMDDYYYY(vaccine.recorded)}
          </TextView>
          <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
            <TextView variant="BitterBoldHeading">{t('vaccines.vaccineName', { name: vaccine.protocolApplied.targetDisease })}</TextView>
          </Box>
          <TextView variant="MobileBodyBold">{t('vaccines.details.manufacturer')}</TextView>
          <TextView variant="MobileBody">
            {vaccine.manufacturer.name} {vaccine.doseQuantity.text}
          </TextView>
          <TextView variant="MobileBodyBold">
            {t('vaccines.details.lot') + ' '}
            <TextView variant="MobileBody">{vaccine.lotNumber}</TextView>
          </TextView>
          <TextView variant="MobileBodyBold">
            {t('vaccines.details.series') + ' '}
            <TextView variant="MobileBody">
              {t('vaccines.details.series.display', { doseNumber: vaccine.protocolApplied.doseNumber, seriesDoses: vaccine.protocolApplied.seriesDoses })}
            </TextView>
          </TextView>
          <TextView variant="MobileBodyBold">
            {t('vaccines.details.status') + ' '}
            <TextView variant="MobileBody">{vaccine.status}</TextView>
          </TextView>
          <Box mt={theme.dimensions.contentMarginTop}>
            <TextView variant="MobileBodyBold">{t('vaccines.details.provider')}</TextView>
            <TextView variant="MobileBody">{vaccine.location.name}</TextView>
            {addressLines}
            <TextView variant="MobileBody">
              {t('vaccines.details.address', {
                city: vaccine.location.address.city,
                state: vaccine.location.address.state,
                zip: vaccine.location.address.postalCode,
              })}
            </TextView>
          </Box>
          <Box mt={theme.dimensions.contentMarginTop}>
            <TextView variant="MobileBodyBold">
              {t('vaccines.details.reaction') + ' '}
              <TextView variant="MobileBody">{reactionListStr}</TextView>
            </TextView>
            <TextView variant="MobileBodyBold">{t('vaccines.details.notes')}</TextView>
            {notes}
          </Box>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default VaccineDetailsScreen
