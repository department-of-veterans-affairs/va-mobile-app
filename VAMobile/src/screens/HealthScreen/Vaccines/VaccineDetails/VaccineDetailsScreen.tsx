import { StackScreenProps } from '@react-navigation/stack'
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

  return (
    <VAScrollView {...testIdProps('Vaccine-details-page')}>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        <TextArea>
          <TextView color="primary" variant="MobileBody" mb={standardMarginBetween}>
            {formatDateMMMMDDYYYY(vaccine.attributes.date)}
          </TextView>
          <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
            <TextView variant="BitterBoldHeading">{t('vaccines.vaccineName', { name: vaccine.attributes.groupName })}</TextView>
          </Box>
          <TextView variant="MobileBodyBold">{t('vaccines.details.manufacturer')}</TextView>
          <TextView variant="MobileBody">{vaccine.attributes.shortDescription}</TextView>
          {vaccine.attributes.doseNumber && vaccine.attributes.doseSeries && (
            <TextView variant="MobileBodyBold">
              {t('vaccines.details.series') + ' '}
              <TextView variant="MobileBody">
                {t('vaccines.details.series.display', { doseNumber: vaccine.attributes.doseNumber, seriesDoses: vaccine.attributes.doseSeries })}
              </TextView>
            </TextView>
          )}
          {vaccine.attributes.note && (
            <Box mt={theme.dimensions.contentMarginTop}>
              <TextView variant="MobileBodyBold">{t('vaccines.details.notes')}</TextView>
              <TextView variant="MobileBody">{vaccine.attributes.note}</TextView>
            </Box>
          )}
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default VaccineDetailsScreen
