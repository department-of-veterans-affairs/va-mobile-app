import React from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigation } from '@react-navigation/native'

import { DateTime } from 'luxon'
import { map } from 'underscore'

import { useDisabilityRating } from 'api/disabilityRating'
import { IndividualRatingData } from 'api/types'
import {
  Box,
  ChildTemplate,
  ClickForActionLink,
  ClickToCallPhoneNumber,
  DefaultList,
  DefaultListItemObj,
  ErrorComponent,
  LinkButtonProps,
  LinkTypeOptionsConstants,
  LinkUrlIconType,
  LoadingComponent,
  TextArea,
  TextLine,
  TextView,
  TextViewProps,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { capitalizeFirstLetter, displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useDowntime, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import NoDisabilityRatings from './NoDisabilityRatings/NoDisabilityRatings'

function DisabilityRatingsScreen() {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigation = useNavigation()

  const { LINK_URL_ABOUT_DISABILITY_RATINGS } = getEnv()
  const { condensedMarginBetween, contentMarginBottom, gutter } = theme.dimensions

  const drNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.disabilityRating)
  const {
    data: ratingData,
    isLoading: loading,
    isError: useDisabilityRatingError,
  } = useDisabilityRating({
    enabled: screenContentAllowed('WG_DisabilityRatings') && drNotInDowntime,
  })

  const individualRatingsList: Array<IndividualRatingData> = ratingData?.individualRatings || []
  const totalCombinedRating = ratingData?.combinedDisabilityRating

  const individualRatings: Array<DefaultListItemObj> = map(individualRatingsList, (rating: IndividualRatingData) => {
    const { ratingPercentage, decision, effectiveDate, diagnosticText } = rating

    const decisionText = t('disabilityRatingDetails.serviceConnected', {
      yesOrNo: decision === 'Service Connected' ? 'Yes' : 'No',
    })
    // must check only for null or undefined. 0 is a valid rating
    const percentageText =
      ratingPercentage !== undefined && ratingPercentage !== null
        ? t('disabilityRatingDetails.percentage', { rate: ratingPercentage })
        : ''
    const formattedEffectiveDateText =
      effectiveDate !== undefined && effectiveDate !== null
        ? t('disabilityRatingDetails.effectiveDate', {
            dateEffective: DateTime.fromISO(effectiveDate).toUTC().toFormat('MM/dd/yyyy'),
          })
        : ''

    const textLines: Array<TextLine> = []
    percentageText && textLines.push({ text: percentageText, variant: 'MobileBodyBold' })
    textLines.push({ text: capitalizeFirstLetter(diagnosticText) }, { text: decisionText })
    formattedEffectiveDateText && textLines.push({ text: formattedEffectiveDateText })

    return {
      textLines,
      testId: `${percentageText} ${diagnosticText} ${decisionText} ${formattedEffectiveDateText}`,
    }
  })

  const getCombinedTotalSection = () => {
    // must check only for null or undefined. 0 is a valid rating
    const combinedPercentText =
      totalCombinedRating !== undefined && totalCombinedRating !== null
        ? t('disabilityRatingDetails.percentage', { rate: totalCombinedRating })
        : undefined
    const combinedTotalSummaryText = t('disabilityRatingDetails.combinedTotalSummary')

    return (
      <Box>
        <Box accessible={true} accessibilityRole={'header'}>
          <TextView {...titleProps} selectable={false}>
            {t('disabilityRatingDetails.combinedTotalTitle')}
          </TextView>
        </Box>

        <TextArea>
          <Box accessible={true}>
            {combinedPercentText && (
              <TextView variant="MobileBodyBold" accessibilityRole="text">
                {combinedPercentText}
              </TextView>
            )}
            <TextView variant="MobileBody" selectable={false}>
              {combinedTotalSummaryText}
            </TextView>
          </Box>
        </TextArea>
      </Box>
    )
  }

  const getLearnAboutVaRatingSection = () => {
    return (
      <TextArea>
        <Box accessible={true} accessibilityRole={'header'}>
          <TextView
            variant="MobileBodyBold"
            accessibilityRole="header"
            selectable={false}
            accessibilityLabel={a11yLabelVA(t('disabilityRating.learnAbout'))}>
            {t('disabilityRating.learnAbout')}
          </TextView>
        </Box>
        <Box accessible={true}>
          <TextView
            variant="MobileBody"
            accessibilityRole="text"
            selectable={false}
            accessibilityLabel={a11yLabelVA(t('disabilityRating.learnAboutSummary'))}
            paragraphSpacing={true}>
            {t('disabilityRating.learnAboutSummary')}
          </TextView>
        </Box>
        <ClickForActionLink {...clickToCallProps} />
      </TextArea>
    )
  }

  const getNeedHelpSection = () => {
    return (
      <TextArea>
        <Box accessible={true} accessibilityRole={'header'}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('disabilityRatingDetails.needHelp')}
          </TextView>
        </Box>
        <Box accessible={true}>
          <TextView
            variant="MobileBody"
            selectable={false}
            accessibilityLabel={t('claimDetails.callVA.a11yLabel')}
            paragraphSpacing={true}>
            {t('claimDetails.callVA')}
          </TextView>
        </Box>
        <ClickToCallPhoneNumber phone={displayedTextPhoneNumber(t('8008271000'))} />
      </TextArea>
    )
  }

  const clickToCallProps: LinkButtonProps = {
    displayedText: t('disabilityRating.learnAboutLinkTitle'),
    linkType: LinkTypeOptionsConstants.url,
    linkUrlIconType: LinkUrlIconType.Arrow,
    numberOrUrlLink: LINK_URL_ABOUT_DISABILITY_RATINGS,
    accessibilityHint: t('disabilityRating.learnAboutLinkTitle.a11yHint'),
    a11yLabel: a11yLabelVA(t('disabilityRating.learnAboutLinkTitle')),
    testID: 'aboutDisabilityRatingsTestID',
  }

  const titleProps: TextViewProps = {
    variant: 'TableHeaderBold',
    mx: gutter,
    mb: condensedMarginBetween,
    accessibilityRole: 'header',
  }

  return (
    <ChildTemplate
      backLabel={t('benefits.title')}
      backLabelOnPress={navigation.goBack}
      title={t('disabilityRatingDetails.title')}
      testID="disabilityRatingTestID">
      {useDisabilityRatingError ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID} />
      ) : loading ? (
        <LoadingComponent text={t('disabilityRating.loading')} />
      ) : individualRatingsList.length === 0 ? (
        <NoDisabilityRatings />
      ) : (
        <>
          <Box>{getCombinedTotalSection()}</Box>
          <Box mb={condensedMarginBetween}>
            <DefaultList
              items={individualRatings}
              title={t('disabilityRatingDetails.individualTitle')}
              selectable={true}
            />
          </Box>
          <Box mb={condensedMarginBetween}>{getLearnAboutVaRatingSection()}</Box>
          <Box mb={contentMarginBottom}>{getNeedHelpSection()}</Box>
        </>
      )}
    </ChildTemplate>
  )
}

export default DisabilityRatingsScreen
