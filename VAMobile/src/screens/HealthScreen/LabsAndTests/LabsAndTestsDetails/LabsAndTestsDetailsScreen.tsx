import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { every } from 'underscore'

import { useAllergies } from 'api/allergies/getAllergies'
import { Box, FeatureLandingTemplate, LoadingComponent, TextArea, TextView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import { HealthStackParamList } from '../../HealthStackScreens'

type LabsAndTestsDetailsScreenProps = StackScreenProps<HealthStackParamList, 'LabsAndTestsDetailsScreen'>

type LabDisplayData = {
  typeOfTest: string
  siteSampled: string
  collectionSample: string
  orderedBy: string
  location: string
  dateCompleted: string
}

/**
 * Screen providing details on an lab or test
 */
function LabsAndTestsDetailsScreen({ route, navigation }: LabsAndTestsDetailsScreenProps) {
  const dispatch = useAppDispatch()
  const { labOrTest } = route.params

  const detailsLoading = false

  // analtyics
  useEffect(() => {
    logAnalyticsEvent(Events.vama_lab_or_test_details())
  }, [dispatch, labOrTest])

  if (!labOrTest) {
    return <></>
  }

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { contentMarginBottom, standardMarginBetween } = theme.dimensions

  const placeHolder = t('noneNoted')

  const data: LabDisplayData = {
    typeOfTest: 'typpeeeee' || placeHolder,
    siteSampled: 'sample at site' || placeHolder,
    collectionSample: 'sample collection' || placeHolder,
    orderedBy: 'Dr Dave' || placeHolder,
    location: 'Our House' || placeHolder,
    dateCompleted: labOrTest.attributes?.issued ? formatDateMMMMDDYYYY(labOrTest.attributes.issued) : placeHolder,
  }

  const keys = Object.keys(data)

  const code = labOrTest.attributes?.code
  const displayDate = labOrTest.attributes?.effectiveDateTime
    ? formatDateMMMMDDYYYY(labOrTest.attributes.effectiveDateTime)
    : placeHolder

  return (
    <FeatureLandingTemplate
      backLabel={t('labsAndTests.details.backButton')}
      backLabelA11y={a11yLabelVA(t('labsAndTests.details.backButton'))}
      backLabelOnPress={navigation.goBack}
      title={t('details')}
      backLabelTestID="allergiesDetailsBackID">
      {detailsLoading ? (
        <LoadingComponent text={t('labsAndTests.details.loading')} />
      ) : (
        <Box mb={contentMarginBottom}>
          <TextArea>
            <TextView variant="MobileBody" mb={standardMarginBetween}>
              {displayDate}
            </TextView>
            <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
              <TextView variant="MobileBodyBold">{code}</TextView>
            </Box>
            {keys.map((key: string) => (
              <Box key={key} mb={standardMarginBetween}>
                <TextView variant="MobileBodyBold">{t(`labsAndTests.details.${key}`)}</TextView>
                <TextView variant="MobileBody">{data[key]}</TextView>
              </Box>
            ))}
          </TextArea>
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default LabsAndTestsDetailsScreen
