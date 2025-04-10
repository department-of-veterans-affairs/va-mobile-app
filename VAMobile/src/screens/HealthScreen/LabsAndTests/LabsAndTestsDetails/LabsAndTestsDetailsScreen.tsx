import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { atob } from 'react-native-quick-base64'

import { StackScreenProps } from '@react-navigation/stack'

import {
  Box,
  DefaultList,
  DefaultListItemObj,
  FeatureLandingTemplate,
  LoadingComponent,
  TextArea,
  TextLine,
  TextView,
  TextViewProps,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { VATypographyThemeVariants } from 'styles/theme'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useTheme } from 'utils/hooks'

import { Observation } from '../../../../api/types/LabsAndTestsData'
import { HealthStackParamList } from '../../HealthStackScreens'

type LabsAndTestsDetailsScreenProps = StackScreenProps<HealthStackParamList, 'LabsAndTestsDetailsScreen'>

type LabDisplayData = {
  sampleTested: string
  bodySite: string
  location: string
  dateCompleted: string
  orderedBy: string
}

/**
 * Screen providing details on an lab or test
 */
function LabsAndTestsDetailsScreen({ route, navigation }: LabsAndTestsDetailsScreenProps) {
  const dispatch = useAppDispatch()
  const { labOrTest } = route.params

  const detailsLoading = false

  // analytics
  useEffect(() => {
    logAnalyticsEvent(
      Events.vama_lab_or_test_details({
        labType: labOrTest.attributes?.display || 'unknown',
      }),
    )
  }, [dispatch, labOrTest])

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { standardMarginBetween, condensedMarginBetween, tinyMarginBetween } = theme.dimensions

  const placeHolder = t('noneNoted')

  if (!labOrTest) {
    return <></>
  }

  const data: LabDisplayData = {
    sampleTested: labOrTest.attributes?.sampleTested || placeHolder,
    bodySite: labOrTest.attributes?.bodySite || placeHolder,
    location: labOrTest.attributes?.location || placeHolder,
    dateCompleted: labOrTest.attributes?.dateCompleted
      ? formatDateMMMMDDYYYY(labOrTest.attributes.dateCompleted)
      : placeHolder,
    orderedBy: labOrTest.attributes?.orderedBy || placeHolder,
  }

  const keys = Object.keys(data) as (keyof LabDisplayData)[]
  const displayName = labOrTest.attributes?.display

  const decodedReport = labOrTest.attributes?.encodedData ? atob(labOrTest.attributes?.encodedData) : placeHolder

  const observationsPresent = (labOrTest.attributes?.observations?.length ?? 0) > 0

  // string, marginBottom, marginTop, variant
  const getTextLine = (
    text: string | null,
    mb: number,
    mt: number,
    variant: keyof VATypographyThemeVariants = 'MobileBody',
  ): TextLine | undefined => {
    return text ? { text, variant, mt, mb } : undefined
  }

  const getTextLinesForLabResults = (observation: Observation): Array<TextLine> => {
    const value = observation?.value?.text || null
    return [
      getTextLine(observation?.testCode, condensedMarginBetween, tinyMarginBetween, 'LabResultHeader') || {
        text: placeHolder,
      },
      getTextLine(t('labsAndTests.details.sampleTested'), 0, condensedMarginBetween, 'MobileBodyBold') || {
        text: placeHolder,
      },
      getTextLine(observation?.sampleTested, condensedMarginBetween, 0, 'MobileBody') || { text: placeHolder },
      getTextLine(t('labsAndTests.details.bodySite'), 0, condensedMarginBetween, 'MobileBodyBold') || {
        text: placeHolder,
      },
      getTextLine(observation?.bodySite, condensedMarginBetween, 0, 'MobileBody') || { text: placeHolder },

      getTextLine(t('labsAndTests.details.result'), 0, condensedMarginBetween, 'MobileBodyBold') || {
        text: placeHolder,
      },
      getTextLine(value, condensedMarginBetween, 0, 'MobileBody') || { text: placeHolder },
      getTextLine(t('labsAndTests.details.referenceRange'), 0, condensedMarginBetween, 'MobileBodyBold') || {
        text: placeHolder,
      },
      getTextLine(observation?.referenceRange, condensedMarginBetween, 0, 'MobileBody') || { text: placeHolder },
      getTextLine(t('labsAndTests.details.status'), 0, condensedMarginBetween, 'MobileBodyBold') || {
        text: placeHolder,
      },
      getTextLine(observation?.status, condensedMarginBetween, 0, 'MobileBody') || { text: placeHolder },
      getTextLine(t('labsAndTests.details.comment'), 0, condensedMarginBetween, 'MobileBodyBold') || {
        text: placeHolder,
      },
      getTextLine(observation?.comment, condensedMarginBetween, 0, 'MobileBody') || { text: placeHolder },
    ]
  }

  const getListItemsForLabResults = (listOfResults: Array<Observation>): Array<DefaultListItemObj> => {
    const listItems: Array<DefaultListItemObj> = []

    listOfResults.map((result, index) => {
      const textLines = getTextLinesForLabResults(result)

      listItems.push({
        textLines,
        a11yValue: t('listPosition', { position: index + 1, total: listOfResults.length }),
        a11yHintText: t('labsAndTests.details.results.accessibilityHint'),
        testId: getTestIDFromTextLines(textLines),
      })
    })
    return listItems
  }

  // Setting this testId also sets the ally label for the list item
  const getTestIDFromTextLines = (textLines: Array<TextLine>): string => {
    return textLines.map((line) => line.text).join(' ')
  }

  // style `Results` as a title to match `Details`
  const titleProps: TextViewProps = {
    variant: 'BitterHeading',
    mx: 6,
    mb: standardMarginBetween,
    mt: standardMarginBetween,
    accessibilityRole: 'header',
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('labsAndTests.details.backButton')}
      backLabelA11y={a11yLabelVA(t('labsAndTests.details.backButton'))}
      backLabelOnPress={navigation.goBack}
      title={t('details')}
      backLabelTestID="labsAndTestsDetailsBackID"
      testID="labsAndTestsDetailsScreen">
      {detailsLoading ? (
        <LoadingComponent text={t('labsAndTests.details.loading')} />
      ) : (
        <Box mb={standardMarginBetween}>
          <TextArea>
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
      {observationsPresent && (
        <Box>
          <Box mx={theme.dimensions.tinyMarginBetween}>
            <TextView {...titleProps} accessibilityLabel={a11yLabelVA(t('labsAndTests.details.results'))}>
              {t('labsAndTests.details.results')}
            </TextView>
          </Box>
          <Box mb={theme.dimensions.standardMarginBetween}>
            <DefaultList items={getListItemsForLabResults(labOrTest.attributes?.observations || [])} />
          </Box>
        </Box>
      )}
      <Box mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
        <TextView variant="HelperText" accessibilityLabel={a11yLabelVA(t('health.details.weBaseThis'))}>
          {t('health.details.weBaseThis')}
        </TextView>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default LabsAndTestsDetailsScreen
