import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useVaccineLocation } from 'api/vaccines/getVaccineLocation'
import { AlertWithHaptics, Box, FeatureLandingTemplate, LoadingComponent, TextArea, TextView } from 'components'
import { Events } from 'constants/analytics'
import { COVID19 } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import { HealthStackParamList } from '../../HealthStackScreens'

type VaccineDetailsScreenProps = StackScreenProps<HealthStackParamList, 'VaccineDetails'>

/**
 * Screen providing details on an vaccine
 */
function VaccineDetailsScreen({ route, navigation }: VaccineDetailsScreenProps) {
  const { vaccine } = route.params
  const { data: location, isLoading: detailsLoading } = useVaccineLocation(
    vaccine.relationships?.location?.data?.id || '',
    {
      enabled: !!vaccine.relationships?.location?.data?.id && screenContentAllowed('WG_VaccineDetails'),
    },
  )

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { contentMarginBottom, standardMarginBetween } = theme.dimensions
  const dispatch = useAppDispatch()

  const placeHolder = t('noneNoted')

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
      {detailsLoading ? (
        <LoadingComponent text={t('vaccines.details.loading')} />
      ) : (
        <>
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
                {location && (
                  <>
                    <TextView variant="MobileBody" selectable={true}>
                      {location.data.attributes.name}
                    </TextView>
                    <TextView variant="MobileBody" selectable={true}>
                      {location.data.attributes.address?.street}
                    </TextView>
                    <TextView variant="MobileBody" selectable={true}>
                      {t('vaccines.details.address', {
                        city: location.data.attributes.address?.city,
                        state: location.data.attributes.address?.state,
                        zip: location.data.attributes.address?.zipCode,
                      })}
                    </TextView>
                  </>
                )}
                {!location && (
                  <TextView variant="MobileBody" selectable={true}>
                    {placeHolder}
                  </TextView>
                )}
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
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default VaccineDetailsScreen
