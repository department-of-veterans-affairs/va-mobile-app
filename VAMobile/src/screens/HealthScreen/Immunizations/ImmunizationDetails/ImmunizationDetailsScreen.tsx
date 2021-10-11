import { StackScreenProps } from '@react-navigation/stack'
import { each, map } from 'underscore'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, TextArea, TextView, VAScrollView } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { ImmunizationState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type ImmunizationDetailsScreenProps = StackScreenProps<HealthStackParamList, 'ImmunizationDetails'>

/**
 * Screen providing details on an immunization
 */
const ImmunizationDetailsScreen: FC<ImmunizationDetailsScreenProps> = ({ route }) => {
  const { immunizationId } = route.params
  const { immunizationsById } = useSelector<StoreState, ImmunizationState>((state) => state.immunization)
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const { contentMarginBottom, contentMarginTop, standardMarginBetween } = theme.dimensions

  const immunization = immunizationsById[immunizationId]

  const addressLines = map(immunization.location.address.line || [], (line, idx) => {
    return (
      <TextView variant={'MobileBody'} key={idx}>
        {line}
      </TextView>
    )
  })

  const notes = map(immunization.notes || [], (note, idx) => {
    return (
      <TextView variant={'MobileBody'} key={idx}>
        {note.text}
      </TextView>
    )
  })

  let reactionListStr = ''
  each(immunization.reaction, (reaction) => {
    reactionListStr = `${reactionListStr} ${reaction.detail.display}`
  })

  return (
    <VAScrollView {...testIdProps('Immunization-details-page')}>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        <TextArea>
          <TextView color="primary" variant="MobileBody" mb={standardMarginBetween}>
            {formatDateMMMMDDYYYY(immunization.recorded)}
          </TextView>
          <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
            <TextView variant="BitterBoldHeading">{t('immunizations.vaccineName', { name: immunization.protocolApplied.targetDisease })}</TextView>
          </Box>
          <TextView variant="MobileBodyBold">{t('immunizations.details.manufacturer')}</TextView>
          <TextView variant="MobileBody">
            {immunization.manufacturer.name} {immunization.doseQuantity.text}
          </TextView>
          <TextView variant="MobileBodyBold">
            {t('immunizations.details.lot') + ' '}
            <TextView variant="MobileBody">{immunization.lotNumber}</TextView>
          </TextView>
          <TextView variant="MobileBodyBold">
            {t('immunizations.details.series') + ' '}
            <TextView variant="MobileBody">
              {t('immunizations.details.series.display', { doseNumber: immunization.protocolApplied.doseNumber, seriesDoses: immunization.protocolApplied.seriesDoses })}
            </TextView>
          </TextView>
          <TextView variant="MobileBodyBold">
            {t('immunizations.details.status') + ' '}
            <TextView variant="MobileBody">{immunization.status}</TextView>
          </TextView>
          <Box mt={theme.dimensions.contentMarginTop}>
            <TextView variant="MobileBodyBold">{t('immunizations.details.provider')}</TextView>
            <TextView variant="MobileBody">{immunization.location.name}</TextView>
            {addressLines}
            <TextView variant="MobileBody">
              {t('immunizations.details.address', {
                city: immunization.location.address.city,
                state: immunization.location.address.state,
                zip: immunization.location.address.postalCode,
              })}
            </TextView>
          </Box>
          <Box mt={theme.dimensions.contentMarginTop}>
            <TextView variant="MobileBodyBold">
              {t('immunizations.details.reaction') + ' '}
              <TextView variant="MobileBody">{reactionListStr}</TextView>
            </TextView>
            <TextView variant="MobileBodyBold">{t('immunizations.details.notes')}</TextView>
            {notes}
          </Box>
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default ImmunizationDetailsScreen
