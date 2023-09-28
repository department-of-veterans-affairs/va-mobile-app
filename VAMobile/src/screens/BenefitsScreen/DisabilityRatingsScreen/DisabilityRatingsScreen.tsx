import { DateTime } from 'luxon'
import { map } from 'underscore'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

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
import { DisabilityRatingState, getDisabilityRating } from 'store/slices/disabilityRatingSlice'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { IndividualRatingData } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { a11yLabelVA } from 'utils/a11yLabel'
import { capitalizeFirstLetter, displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useAppDispatch, useDowntime, useError, useTheme } from 'utils/hooks'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import NoDisabilityRatings from './NoDisabilityRatings/NoDisabilityRatings'
import getEnv from 'utils/env'

const DisabilityRatingsScreen: FC = () => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigation = useNavigation()

  const { LINK_URL_ABOUT_DISABILITY_RATINGS } = getEnv()
  const { loading, needsDataLoad, ratingData } = useSelector<RootState, DisabilityRatingState>((state) => state.disabilityRating)
  const { condensedMarginBetween, contentMarginBottom, gutter } = theme.dimensions

  const individualRatingsList: Array<IndividualRatingData> = ratingData?.individualRatings || []
  const totalCombinedRating = ratingData?.combinedDisabilityRating
  const drNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.disabilityRating)

  useEffect(() => {
    // Get the disability rating data if not loaded already
    if (needsDataLoad && drNotInDowntime) {
      dispatch(getDisabilityRating(ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID))
    }
  }, [dispatch, needsDataLoad, drNotInDowntime])

  const individualRatings: Array<DefaultListItemObj> = map(individualRatingsList, (rating: IndividualRatingData) => {
    const { ratingPercentage, decision, effectiveDate, diagnosticText } = rating

    const decisionText = t('disabilityRatingDetails.serviceConnected', { yesOrNo: decision === 'Service Connected' ? 'Yes' : 'No' })
    // must check only for null or undefined. 0 is a valid rating
    const percentageText = ratingPercentage !== undefined && ratingPercentage !== null ? t('disabilityRatingDetails.percentage', { rate: ratingPercentage }) : ''
    const formattedEffectiveDateText =
      effectiveDate !== undefined && effectiveDate !== null
        ? t('disabilityRatingDetails.effectiveDate', { dateEffective: DateTime.fromISO(effectiveDate).toUTC().toFormat('MM/dd/yyyy') })
        : ''

    let textLines: Array<TextLine> = []

    if (percentageText) {
      textLines.push({
        text: percentageText,
        variant: 'MobileBodyBold',
      })
    }

    textLines = [
      ...textLines,
      {
        text: capitalizeFirstLetter(diagnosticText),
      },
      {
        text: decisionText,
      },
    ]

    if (formattedEffectiveDateText) {
      textLines.push({
        text: formattedEffectiveDateText,
      })
    }

    return {
      textLines,
      testId: `${percentageText} ${diagnosticText} ${decisionText} ${formattedEffectiveDateText}`,
    }
  })

  const getCombinedTotalSection = () => {
    // must check only for null or undefined. 0 is a valid rating
    const combinedPercentText =
      totalCombinedRating !== undefined && totalCombinedRating !== null ? t('disabilityRatingDetails.percentage', { rate: totalCombinedRating }) : undefined
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
          <TextView variant="MobileBodyBold" accessibilityRole="header" selectable={false} accessibilityLabel={a11yLabelVA(t('disabilityRating.learnAbout'))}>
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
          <TextView variant="MobileBody" selectable={false} accessibilityLabel={t('claimDetails.callVA.a11yLabel')} paragraphSpacing={true}>
            {t('claimDetails.callVA')}
          </TextView>
        </Box>
        <ClickToCallPhoneNumber phone={displayedTextPhoneNumber(t('8008271000'))} />
      </TextArea>
    )
  }

  if (useError(ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID)) {
    return (
      <ChildTemplate backLabel={t('benefits.title')} backLabelOnPress={navigation.goBack} title={t('disabilityRatingDetails.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID} />
      </ChildTemplate>
    )
  }

  if (loading) {
    return (
      <ChildTemplate backLabel={t('benefits.title')} backLabelOnPress={navigation.goBack} title={t('disabilityRatingDetails.title')}>
        <LoadingComponent text={t('disabilityRating.loading')} />
      </ChildTemplate>
    )
  }

  if (individualRatingsList.length === 0) {
    return (
      <ChildTemplate backLabel={t('benefits.title')} backLabelOnPress={navigation.goBack} title={t('disabilityRatingDetails.title')}>
        <NoDisabilityRatings />
      </ChildTemplate>
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
    <ChildTemplate backLabel={t('benefits.title')} backLabelOnPress={navigation.goBack} title={t('disabilityRatingDetails.title')} testID="disabilityRatingTestID">
      <Box>{getCombinedTotalSection()}</Box>
      <Box mb={condensedMarginBetween}>
        <DefaultList items={individualRatings} title={t('disabilityRatingDetails.individualTitle')} selectable={true} />
      </Box>
      <Box mb={condensedMarginBetween}>{getLearnAboutVaRatingSection()}</Box>
      <Box mb={contentMarginBottom}>{getNeedHelpSection()}</Box>
    </ChildTemplate>
  )
}

export default DisabilityRatingsScreen
