import { StackScreenProps } from '@react-navigation/stack'
import { every } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, LoadingComponent, TextArea, TextView, VAScrollView } from 'components'
import { COVID19 } from 'constants/common'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { StoreState, VaccineState } from 'store/reducers'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { getVaccineLocation, sendVaccineDetailsAnalytics } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type VaccineDetailsScreenProps = StackScreenProps<HealthStackParamList, 'VaccineDetails'>

/**
 * Screen providing details on an vaccine
 */
const VaccineDetailsScreen: FC<VaccineDetailsScreenProps> = ({ route }) => {
  const { vaccineId } = route.params
  const { vaccinesById, vaccineLocationsById, detailsLoading } = useSelector<StoreState, VaccineState>((state) => state.vaccine)
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const { contentMarginBottom, contentMarginTop, standardMarginBetween } = theme.dimensions
  const dispatch = useDispatch()

  const vaccine = vaccinesById[vaccineId]
  const location = vaccineLocationsById[vaccineId]

  const placeHolder = t('vaccines.details.noneNoted')

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
    return <LoadingComponent text={t('vaccines.loading')} />
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
    <VAScrollView {...testIdProps('Vaccine-details-page')}>
      <Box mt={contentMarginTop} mb={contentMarginBottom}>
        <TextArea>
          <TextView color="primary" variant="MobileBody" mb={standardMarginBetween}>
            {displayDate}
          </TextView>
          <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
            <TextView variant="BitterBoldHeading" color={'primaryTitle'}>
              {displayName}
            </TextView>
          </Box>
          <TextView variant="MobileBodyBold" color={'primaryTitle'}>
            {t('vaccines.details.typeAndDosage')}
          </TextView>
          <TextView variant="MobileBody">{vaccine.attributes?.shortDescription || placeHolder}</TextView>
          {isCovidVaccine && (
            <>
              <TextView variant="MobileBodyBold" color={'primaryTitle'}>
                {t('vaccines.details.manufacturer')}
              </TextView>
              <TextView variant="MobileBody">{vaccine.attributes?.manufacturer || placeHolder}</TextView>
            </>
          )}
          <TextView variant="MobileBodyBold" color={'primaryTitle'}>
            {t('vaccines.details.series')}
          </TextView>
          <TextView variant="MobileBody">{displaySeries}</TextView>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBodyBold" color={'primaryTitle'}>
              {t('vaccines.details.provider')}
            </TextView>
            {location?.attributes && (
              <>
                <TextView variant="MobileBody">{location.attributes.name}</TextView>
                <TextView variant="MobileBody">{location.attributes.address?.street}</TextView>
                <TextView variant="MobileBody">
                  {t('vaccines.details.address', {
                    city: location.attributes.address?.city,
                    state: location.attributes.address?.state,
                    zip: location.attributes.address?.zipCode,
                  })}
                </TextView>
              </>
            )}
            {!location?.attributes && <TextView variant="MobileBody">{placeHolder}</TextView>}
          </Box>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <Box>
              <TextView variant="MobileBodyBold" color={'primaryTitle'}>
                {t('vaccines.details.reaction')}
              </TextView>
              <TextView variant="MobileBody">{vaccine.attributes?.reaction || placeHolder}</TextView>
            </Box>
            <TextView variant="MobileBodyBold" color={'primaryTitle'}>
              {t('vaccines.details.notes')}
            </TextView>
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
