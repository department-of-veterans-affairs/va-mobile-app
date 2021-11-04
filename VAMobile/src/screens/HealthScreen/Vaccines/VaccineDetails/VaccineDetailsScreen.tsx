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
  const placeHolder = t('vaccines.details.unavailable')

  if (!vaccine) {
    return <></>
  }

  const displayDate = vaccine.attributes?.date ? formatDateMMMMDDYYYY(vaccine.attributes.date) : placeHolder

  const displayName = vaccine.attributes?.groupName ? t('vaccines.vaccineName', { name: vaccine.attributes.groupName }) : placeHolder

  const hasSeries = vaccine.attributes?.doseNumber && vaccine.attributes?.doseSeries
  const displaySeries = hasSeries ? t('vaccines.details.series.display', { doseNumber: vaccine.attributes?.doseNumber, seriesDoses: vaccine.attributes?.doseSeries }) : placeHolder

  const isPartialData = !hasSeries || !vaccine.attributes?.note

  return (
    <VAScrollView {...testIdProps('Vaccine-details-page')}>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        <TextArea>
          <TextView color="primary" variant="MobileBody" mb={standardMarginBetween}>
            {displayDate}
          </TextView>
          <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
            <TextView variant="BitterBoldHeading">{displayName}</TextView>
          </Box>
          <TextView variant="MobileBodyBold">{t('vaccines.details.manufacturer')}</TextView>
          <TextView variant="MobileBody">{vaccine.attributes?.shortDescription || placeHolder}</TextView>
          <TextView variant="MobileBodyBold">
            {t('vaccines.details.series') + '  '}
            <TextView variant="MobileBody">{displaySeries}</TextView>
          </TextView>
          <Box mt={theme.dimensions.contentMarginTop}>
            <TextView variant="MobileBodyBold">{t('vaccines.details.notes')}</TextView>
            <TextView variant="MobileBody">{vaccine.attributes?.note || placeHolder}</TextView>
          </Box>
        </TextArea>
        {isPartialData && (
          <Box mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
            <TextView variant="HelperText">{t('vaccines.details.weBaseThis')}</TextView>
          </Box>
        )}
      </Box>
    </VAScrollView>
  )
}

export default VaccineDetailsScreen
