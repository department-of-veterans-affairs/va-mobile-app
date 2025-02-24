import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { atob } from 'react-native-quick-base64'

import { StackScreenProps } from '@react-navigation/stack'

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
  location: string
  siteSampled: string
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

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { contentMarginBottom, standardMarginBetween } = theme.dimensions

  const placeHolder = t('noneNoted')

  if (!labOrTest) {
    return <></>
  }

  const data: LabDisplayData = {
    siteSampled: labOrTest.attributes?.sampleSite || placeHolder,
    location: labOrTest.attributes?.location || placeHolder,
    dateCompleted: labOrTest.attributes?.dateCompleted
      ? formatDateMMMMDDYYYY(labOrTest.attributes.dateCompleted)
      : placeHolder,
  }

  const keys = Object.keys(data) as (keyof LabDisplayData)[]
  const displayName = labOrTest.attributes?.display

  const decodedReport = labOrTest.attributes?.encodedData ? atob(labOrTest.attributes?.encodedData) : placeHolder
  // const displayDate = labOrTest.attributes?.dateCompleted
  //   ? formatDateMMMMDDYYYY(labOrTest.attributes.dateCompleted)
  //   : placeHolder

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
            {/* <TextView variant="MobileBody" mb={standardMarginBetween}>
             {displayDate}
            </TextView> */}
            <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
              <TextView variant="MobileBodyBold">{displayName}</TextView>
            </Box>
            {keys.map((key) => (
              <Box key={key} mb={standardMarginBetween}>
                <TextView variant="MobileBodyBold">{t(`labsAndTests.details.${key}`)}</TextView>
                <TextView testID={key} variant="MobileBody">
                  {data[key]}
                </TextView>
              </Box>
            ))}
            <Box accessibilityRole="header" accessible={true} mb={standardMarginBetween}>
              <TextView variant="MobileBodyBold">Report</TextView>
              <TextView variant="MobileBody" testID="decoded-report">
                {decodedReport}
              </TextView>
            </Box>
          </TextArea>
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default LabsAndTestsDetailsScreen
