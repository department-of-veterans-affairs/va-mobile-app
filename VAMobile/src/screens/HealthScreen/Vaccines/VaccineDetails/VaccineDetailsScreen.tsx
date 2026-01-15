import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { AlertWithHaptics, Box, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { Events } from 'constants/analytics'
import { COVID19 } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useTheme } from 'utils/hooks'

type VaccineDetailsScreenProps = StackScreenProps<HealthStackParamList, 'VaccineDetails'>

/**
 * Screen providing details on an vaccine
 */
function VaccineDetailsScreen({ route, navigation }: VaccineDetailsScreenProps) {
  const { vaccine } = route.params

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { contentMarginBottom, standardMarginBetween } = theme.dimensions
  const dispatch = useAppDispatch()

  const placeHolder = t('noneNoted')
  const location = vaccine.attributes?.location

  useEffect(() => {
    logAnalyticsEvent(Events.vama_vaccine_details(vaccine?.attributes?.groupName || ''))
  }, [dispatch, vaccine])

  if (!vaccine) {
    return <></>
  }

  const displayDate = vaccine.attributes?.date ? formatDateMMMMDDYYYY(vaccine.attributes.date) : t('vaccines.noDate')

  const hasName = Boolean(vaccine.attributes?.groupName)
  const displayName = hasName ? t('vaccines.vaccineName', { name: vaccine.attributes?.groupName }) : t('vaccine')

  const hasSeries = vaccine.attributes?.doseNumber && vaccine.attributes?.doseSeries
  const displaySeries = hasSeries
    ? t('vaccines.details.series.display', {
        doseNumber: vaccine.attributes?.doseNumber,
        seriesDoses: vaccine.attributes?.doseSeries,
      })
    : placeHolder

  // Only show the manufacturer label if the vaccine is COVID-19, any other type should not be displayed
  const isCovidVaccine = vaccine.attributes?.groupName?.toUpperCase()?.includes(COVID19)

  return (
    <FeatureLandingTemplate
      backLabel={t('vaVaccines')}
      backLabelA11y={a11yLabelVA(t('vaVaccines'))}
      backLabelOnPress={navigation.goBack}
      title={t('details')}
      backLabelTestID="vaccinesDetailsBackID">
      <Box mb={contentMarginBottom}>
        {!hasName && (
          <AlertWithHaptics
            variant="info"
            header={t('vaccines.missingDetails.header')}
            description={t('vaccines.missingDetails.description')}
          />
        )}
        <TextArea noBorder>
          <TextView variant="MobileBody" mb={standardMarginBetween}>
            {displayDate}
          </TextView>
          <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
            <TextView variant="MobileBodyBold">{displayName}</TextView>
          </Box>
          <TextView variant="MobileBodyBold" selectable={true}>
            {t('vaccines.details.typeAndDosage')}
          </TextView>
          <TextView
            variant="MobileBody"
            selectable={true}
            mb={standardMarginBetween}
            testID={'Type And Dosage ' + vaccine.attributes?.shortDescription || placeHolder}>
            {vaccine.attributes?.shortDescription || placeHolder}
          </TextView>
          {isCovidVaccine && (
            <>
              <TextView variant="MobileBodyBold">{t('vaccines.details.manufacturer')}</TextView>
              <TextView
                variant="MobileBody"
                selectable={true}
                mb={standardMarginBetween}
                testID={'Manufacturer ' + vaccine.attributes?.manufacturer || placeHolder}>
                {vaccine.attributes?.manufacturer || placeHolder}
              </TextView>
            </>
          )}
          <TextView variant="MobileBodyBold">{t('vaccines.details.series')}</TextView>
          <TextView variant="MobileBody" selectable={true} testID={'Series status' + displaySeries}>
            {displaySeries}
          </TextView>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBodyBold">{t('health.details.provider')}</TextView>
            <TextView variant="MobileBody" selectable={true}>
              {location || placeHolder}
            </TextView>
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <Box>
              <TextView variant="MobileBodyBold">{t('health.details.reaction.header')}</TextView>
              <TextView variant="MobileBody" selectable={true} mb={standardMarginBetween}>
                {vaccine.attributes?.reaction || placeHolder}
              </TextView>
            </Box>
            <TextView variant="MobileBodyBold">{t('health.details.notes')}</TextView>
            <TextView
              variant="MobileBody"
              selectable={true}
              testID={'Notes ' + vaccine.attributes?.note || 'None noted'}>
              {vaccine.attributes?.note || placeHolder}
            </TextView>
          </Box>
        </TextArea>
        <Box mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
          <TextView variant="HelperText" accessibilityLabel={a11yLabelVA(t('health.details.weBaseThis'))}>
            {t('health.details.weBaseThis')}
          </TextView>
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default VaccineDetailsScreen
