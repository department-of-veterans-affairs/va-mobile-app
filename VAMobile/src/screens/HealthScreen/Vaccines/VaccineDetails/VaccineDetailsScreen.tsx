import { StackScreenProps } from '@react-navigation/stack'
import { every } from 'underscore'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, FeatureLandingTemplate, LoadingComponent, TextArea, TextView } from 'components'
import { COVID19 } from 'constants/common'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { VaccineState, getVaccineLocation, sendVaccineDetailsAnalytics } from 'store/slices/vaccineSlice'
import { a11yLabelVA } from 'utils/a11yLabel'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useTheme } from 'utils/hooks'

type VaccineDetailsScreenProps = StackScreenProps<HealthStackParamList, 'VaccineDetails'>

/**
 * Screen providing details on an vaccine
 */
const VaccineDetailsScreen: FC<VaccineDetailsScreenProps> = ({ route, navigation }) => {
  const { vaccineId } = route.params
  const { vaccinesById, vaccineLocationsById, detailsLoading } = useSelector<RootState, VaccineState>((state) => state.vaccine)
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { contentMarginBottom, standardMarginBetween } = theme.dimensions
  const dispatch = useAppDispatch()

  const vaccine = vaccinesById[vaccineId]
  const location = vaccineLocationsById[vaccineId]

  const placeHolder = t('noneNoted')

  useEffect(() => {
    if (vaccine && !vaccineLocationsById[vaccineId]) {
      dispatch(getVaccineLocation(vaccineId, vaccine.relationships?.location?.data?.id || ''))
    }
  }, [dispatch, vaccineLocationsById, vaccineId, vaccine])

  useEffect(() => {
    dispatch(sendVaccineDetailsAnalytics(vaccine?.attributes?.groupName || ''))
  }, [dispatch, vaccineId, vaccine])

  if (!vaccine) {
    return <></>
  }

  if (detailsLoading) {
    return (
      <FeatureLandingTemplate backLabel={t('vaVaccines')} backLabelA11y={a11yLabelVA(t('vaVaccines'))} backLabelOnPress={navigation.goBack} title={t('details')}>
        <LoadingComponent text={t('vaccines.details.loading')} />
      </FeatureLandingTemplate>
    )
  }

  const displayDate = vaccine.attributes?.date ? formatDateMMMMDDYYYY(vaccine.attributes.date) : placeHolder

  const displayName = vaccine.attributes?.groupName ? t('vaccines.vaccineName', { name: vaccine.attributes.groupName }) : placeHolder

  const hasSeries = vaccine.attributes?.doseNumber && vaccine.attributes?.doseSeries
  const displaySeries = hasSeries ? t('vaccines.details.series.display', { doseNumber: vaccine.attributes?.doseNumber, seriesDoses: vaccine.attributes?.doseSeries }) : placeHolder

  const optionalFields = [hasSeries, vaccine.attributes?.note, location?.attributes, vaccine.attributes?.reaction]
  const isPartialData = !every(optionalFields)

  // Only show the manufacturer label if the vaccine is COVID-19, any other type should not be displayed
  const isCovidVaccine = vaccine.attributes?.groupName?.toUpperCase()?.includes(COVID19)

  return (
    <FeatureLandingTemplate backLabel={t('vaVaccines')} backLabelA11y={a11yLabelVA(t('vaVaccines'))} backLabelOnPress={navigation.goBack} title={t('details')}>
      <Box mb={contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBody" mb={standardMarginBetween}>
            {displayDate}
          </TextView>
          <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
            <TextView variant="BitterBoldHeading">{displayName}</TextView>
          </Box>
          <TextView variant="MobileBodyBold" selectable={true}>
            {t('vaccines.details.typeAndDosage')}
          </TextView>
          <TextView variant="MobileBody" selectable={true} mb={standardMarginBetween} testID={'Type And Dosage ' + vaccine.attributes?.shortDescription || placeHolder}>
            {vaccine.attributes?.shortDescription || placeHolder}
          </TextView>
          {isCovidVaccine && (
            <>
              <TextView variant="MobileBodyBold">{t('vaccines.details.manufacturer')}</TextView>
              <TextView variant="MobileBody" selectable={true} mb={standardMarginBetween} testID={'Manufacturer ' + vaccine.attributes?.manufacturer || placeHolder}>
                {vaccine.attributes?.manufacturer || placeHolder}
              </TextView>
            </>
          )}
          <TextView variant="MobileBodyBold">{t('vaccines.details.series')}</TextView>
          <TextView variant="MobileBody" selectable={true} testID={'Series status' + displaySeries}>
            {displaySeries}
          </TextView>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBodyBold">{t('vaccines.details.provider')}</TextView>
            {location?.attributes && (
              <>
                <TextView variant="MobileBody" selectable={true}>
                  {location.attributes.name}
                </TextView>
                <TextView variant="MobileBody" selectable={true}>
                  {location.attributes.address?.street}
                </TextView>
                <TextView variant="MobileBody" selectable={true}>
                  {t('vaccines.details.address', {
                    city: location.attributes.address?.city,
                    state: location.attributes.address?.state,
                    zip: location.attributes.address?.zipCode,
                  })}
                </TextView>
              </>
            )}
            {!location?.attributes && (
              <TextView variant="MobileBody" selectable={true}>
                {placeHolder}
              </TextView>
            )}
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <Box>
              <TextView variant="MobileBodyBold">{t('vaccines.details.reaction')}</TextView>
              <TextView variant="MobileBody" selectable={true} mb={standardMarginBetween}>
                {vaccine.attributes?.reaction || placeHolder}
              </TextView>
            </Box>
            <TextView variant="MobileBodyBold">{t('vaccines.details.notes')}</TextView>
            <TextView variant="MobileBody" selectable={true} testID={'Notes ' + vaccine.attributes?.note || 'None noted'}>
              {vaccine.attributes?.note || placeHolder}
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
    </FeatureLandingTemplate>
  )
}

export default VaccineDetailsScreen
