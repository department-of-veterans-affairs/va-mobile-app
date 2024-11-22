import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { every } from 'underscore'

import { useAllergyLocation } from 'api/allergies/getAllergyLocation'
import { Box, FeatureLandingTemplate, LoadingComponent, TextArea, TextView } from 'components'
import { Events } from 'constants/analytics'
import { COVID19 } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import { HealthStackParamList } from '../../HealthStackScreens'

type AllergyDetailsScreenProps = StackScreenProps<HealthStackParamList, 'AllergyDetails'>

/**
 * Screen providing details on an allergy
 */
function AllergyDetailsScreen({ route, navigation }: AllergyDetailsScreenProps) {
  const { allergy } = route.params
  const { data: location, isLoading: detailsLoading } = useAllergyLocation(
    allergy.relationships?.location?.data?.id || '',
    {
      enabled: !!allergy.relationships?.location?.data?.id && screenContentAllowed('WG_VaccineDetails'),
    },
  )

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { contentMarginBottom, standardMarginBetween } = theme.dimensions
  const dispatch = useAppDispatch()

  const placeHolder = t('noneNoted')

  useEffect(() => {
    logAnalyticsEvent(Events.vama_vaccine_details(allergy?.attributes?.groupName || ''))
  }, [dispatch, allergy])

  if (!allergy) {
    return <></>
  }

  const displayDate = allergy.attributes?.date ? formatDateMMMMDDYYYY(allergy.attributes.date) : placeHolder

  const displayName = allergy.attributes?.groupName
    ? t('vaccines.vaccineName', { name: allergy.attributes.groupName })
    : placeHolder

  const hasSeries = allergy.attributes?.doseNumber && allergy.attributes?.doseSeries
  const displaySeries = hasSeries
    ? t('vaccines.details.series.display', {
        doseNumber: allergy.attributes?.doseNumber,
        seriesDoses: allergy.attributes?.doseSeries,
      })
    : placeHolder

  const optionalFields = [hasSeries, allergy.attributes?.note, location?.data, allergy.attributes?.reaction]
  const isPartialData = !every(optionalFields)

  // Only show the manufacturer label if the vaccine is COVID-19, any other type should not be displayed
  const isCovidVaccine = allergy.attributes?.groupName?.toUpperCase()?.includes(COVID19)

  return (
    <FeatureLandingTemplate
      backLabel={t('vaVaccines')}
      backLabelA11y={a11yLabelVA(t('vaVaccines'))}
      backLabelOnPress={navigation.goBack}
      title={t('details')}
      backLabelTestID="allergiesDetailsBackID">
      {detailsLoading ? (
        // <LoadingComponent text={t('vaccines.details.loading')} />
        <LoadingComponent text="Loading your allergy record" />
      ) : (
        <Box mb={contentMarginBottom}>
          <TextArea>
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
              testID={'Type And Dosage ' + allergy.attributes?.shortDescription || placeHolder}>
              {allergy.attributes?.shortDescription || placeHolder}
            </TextView>
            {isCovidVaccine && (
              <>
                <TextView variant="MobileBodyBold">{t('vaccines.details.manufacturer')}</TextView>
                <TextView
                  variant="MobileBody"
                  selectable={true}
                  mb={standardMarginBetween}
                  testID={'Manufacturer ' + allergy.attributes?.manufacturer || placeHolder}>
                  {allergy.attributes?.manufacturer || placeHolder}
                </TextView>
              </>
            )}
            <TextView variant="MobileBodyBold">{t('vaccines.details.series')}</TextView>
            <TextView variant="MobileBody" selectable={true} testID={'Series status' + displaySeries}>
              {displaySeries}
            </TextView>
            <Box mt={theme.dimensions.standardMarginBetween}>
              <TextView variant="MobileBodyBold">{t('vaccines.details.provider')}</TextView>
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
                <TextView variant="MobileBodyBold">{t('vaccines.details.reaction')}</TextView>
                <TextView variant="MobileBody" selectable={true} mb={standardMarginBetween}>
                  {allergy.attributes?.reaction || placeHolder}
                </TextView>
              </Box>
              <TextView variant="MobileBodyBold">{t('vaccines.details.notes')}</TextView>
              <TextView
                variant="MobileBody"
                selectable={true}
                testID={'Notes ' + allergy.attributes?.note || 'None noted'}>
                {allergy.attributes?.note || placeHolder}
              </TextView>
            </Box>
          </TextArea>
          {isPartialData && (
            <Box mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
              <TextView variant="HelperText" accessibilityLabel={a11yLabelVA(t('vaccines.details.weBaseThis'))}>
                {t('vaccines.details.weBaseThis')}
              </TextView>
            </Box>
          )}
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default AllergyDetailsScreen
