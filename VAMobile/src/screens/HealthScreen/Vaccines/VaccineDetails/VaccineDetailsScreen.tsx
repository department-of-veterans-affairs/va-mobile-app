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
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch } from 'utils/hooks'
import { useTheme } from 'utils/hooks/useTheme'

type VaccineDetailsScreenProps = StackScreenProps<HealthStackParamList, 'VaccineDetails'>

/**
 * Screen providing details on an vaccine
 */
const VaccineDetailsScreen: FC<VaccineDetailsScreenProps> = ({ route, navigation }) => {
  const { vaccineId } = route.params
  const { vaccinesById, vaccineLocationsById, detailsLoading } = useSelector<RootState, VaccineState>((state) => state.vaccine)
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()

  const vaccine = vaccinesById[vaccineId]
  const location = vaccineLocationsById[vaccineId]

  const placeHolder = tc('noneNoted')

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
      <FeatureLandingTemplate backLabel={tc('vaVaccines')} backLabelA11y={tc('vaVaccines.a11y')} backLabelOnPress={navigation.goBack} title={tc('details')}>
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
    <FeatureLandingTemplate backLabel={tc('vaVaccines')} backLabelA11y={tc('vaVaccines.a11y')} backLabelOnPress={navigation.goBack} title={tc('details')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
            {displayDate}
          </TextView>
          <Box accessibilityRole="header" accessible={true} mb={theme.dimensions.standardMarginBetween}>
            <TextView variant="BitterBoldHeading">{displayName}</TextView>
          </Box>
          <TextView variant="MobileBodyBold" selectable={true}>
            {t('vaccines.details.typeAndDosage')}
          </TextView>
          <TextView variant="MobileBody" selectable={true} mb={theme.dimensions.standardMarginBetween}>
            {vaccine.attributes?.shortDescription || placeHolder}
          </TextView>
          {isCovidVaccine && (
            <>
              <TextView variant="MobileBodyBold">{t('vaccines.details.manufacturer')}</TextView>
              <TextView variant="MobileBody" selectable={true} mb={theme.dimensions.standardMarginBetween}>
                {vaccine.attributes?.manufacturer || placeHolder}
              </TextView>
            </>
          )}
          <TextView variant="MobileBodyBold">{t('vaccines.details.series')}</TextView>
          <TextView variant="MobileBody" selectable={true}>
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
              <TextView variant="MobileBody" selectable={true} mb={theme.dimensions.standardMarginBetween}>
                {vaccine.attributes?.reaction || placeHolder}
              </TextView>
            </Box>
            <TextView variant="MobileBodyBold">{t('vaccines.details.notes')}</TextView>
            <TextView variant="MobileBody" selectable={true}>
              {vaccine.attributes?.note || placeHolder}
            </TextView>
          </Box>
        </TextArea>
        {isPartialData && (
          <Box mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
            <TextView variant="HelperText">{t('vaccines.details.weBaseThis')}</TextView>
          </Box>
        )}
      </Box>
    </FeatureLandingTemplate>
  )
}

export default VaccineDetailsScreen
