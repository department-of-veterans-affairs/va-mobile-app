import { StackScreenProps } from '@react-navigation/stack'
import { every } from 'underscore'
import React, { FC, useEffect } from 'react'

import { Box, LoadingComponent, TextArea, TextView, VAScrollView } from 'components'
import { COVID19 } from 'constants/common'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { VaccineState, getVaccineLocation, sendVaccineDetailsAnalytics } from 'store/slices/vaccineSlice'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useTheme, useTranslation } from 'utils/hooks'
import { useSelector } from 'react-redux'

type VaccineDetailsScreenProps = StackScreenProps<HealthStackParamList, 'VaccineDetails'>

/**
 * Screen providing details on an vaccine
 */
const VaccineDetailsScreen: FC<VaccineDetailsScreenProps> = ({ route }) => {
  const { vaccineId } = route.params
  const { vaccinesById, vaccineLocationsById, detailsLoading } = useSelector<RootState, VaccineState>((state) => state.vaccine)
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const { contentMarginBottom, contentMarginTop, standardMarginBetween } = theme.dimensions
  const dispatch = useAppDispatch()

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
          <TextView variant="MobileBodyBold" selectable={true} color={'primaryTitle'}>
            {t('vaccines.details.typeAndDosage')}
          </TextView>
          <TextView variant="MobileBody" selectable={true}>
            {vaccine.attributes?.shortDescription || placeHolder}
          </TextView>
          {isCovidVaccine && (
            <>
              <TextView variant="MobileBodyBold" color={'primaryTitle'}>
                {t('vaccines.details.manufacturer')}
              </TextView>
              <TextView variant="MobileBody" selectable={true}>
                {vaccine.attributes?.manufacturer || placeHolder}
              </TextView>
            </>
          )}
          <TextView variant="MobileBodyBold" color={'primaryTitle'}>
            {t('vaccines.details.series')}
          </TextView>
          <TextView variant="MobileBody" selectable={true}>
            {displaySeries}
          </TextView>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <TextView variant="MobileBodyBold" color={'primaryTitle'}>
              {t('vaccines.details.provider')}
            </TextView>
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
              <TextView variant="MobileBodyBold" color={'primaryTitle'}>
                {t('vaccines.details.reaction')}
              </TextView>
              <TextView variant="MobileBody" selectable={true}>
                {vaccine.attributes?.reaction || placeHolder}
              </TextView>
            </Box>
            <TextView variant="MobileBodyBold" color={'primaryTitle'}>
              {t('vaccines.details.notes')}
            </TextView>
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
    </VAScrollView>
  )
}

export default VaccineDetailsScreen
