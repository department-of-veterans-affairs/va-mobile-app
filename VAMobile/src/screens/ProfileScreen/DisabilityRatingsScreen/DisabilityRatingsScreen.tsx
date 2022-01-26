import { DateTime } from 'luxon'
import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import {
  Box,
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
  VAScrollView,
} from 'components'
import { DisabilityRatingState, StoreState, getDisabilityRating } from 'store'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { IndividualRatingData } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { capitalizeFirstLetter } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useDowntime, useError, useTheme, useTranslation } from 'utils/hooks'
import NoDisabilityRatings from './NoDisabilityRatings/NoDisabilityRatings'
import ProfileBanner from '../ProfileBanner'
import getEnv from 'utils/env'

const DisabilityRatingsScreen: FC = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)

  const { LINK_URL_ABOUT_DISABILITY_RATINGS } = getEnv()
  const { loading, needsDataLoad, ratingData } = useSelector<StoreState, DisabilityRatingState>((s) => s.disabilityRating)
  const { condensedMarginBetween, contentMarginBottom, gutter, standardMarginBetween } = theme.dimensions

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
          <TextView variant="MobileBodyBold" accessibilityRole="header" selectable={false} accessibilityLabel={t('disabilityRating.learnAbout.A11yLabel')}>
            {t('disabilityRating.learnAbout')}
          </TextView>
        </Box>
        <Box accessible={true}>
          <TextView variant="MobileBody" accessibilityRole="text" selectable={false} accessibilityLabel={t('disabilityRating.learnAboutSummary.a11yLabel')}>
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
          <TextView variant="MobileBody" selectable={false} accessibilityLabel={t('claims:claimDetails.callVA.a11yLabel')}>
            {t('claims:claimDetails.callVA')}
          </TextView>
        </Box>

        <ClickToCallPhoneNumber phone={t('common:8008271000.displayText')} />
      </TextArea>
    )
  }

  if (useError(ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID} />
  }

  if (loading) {
    return (
      <React.Fragment>
        <ProfileBanner showRating={false} />
        <LoadingComponent />
      </React.Fragment>
    )
  }

  if (individualRatingsList.length === 0) {
    return <NoDisabilityRatings />
  }

  const clickToCallProps: LinkButtonProps = {
    displayedText: t('disabilityRating.learnAboutLinkTitle'),
    linkType: LinkTypeOptionsConstants.url,
    linkUrlIconType: LinkUrlIconType.Arrow,
    numberOrUrlLink: LINK_URL_ABOUT_DISABILITY_RATINGS,
    accessibilityHint: t('disabilityRating.learnAboutLinkTitle.a11yHint'),
    accessibilityLabel: t('disabilityRating.learnAboutLinkTitle.a11yLabel'),
  }

  const titleProps: TextViewProps = {
    variant: 'TableHeaderBold',
    mx: gutter,
    mb: condensedMarginBetween,
    mt: standardMarginBetween,
    accessibilityRole: 'header',
  }

  return (
    <VAScrollView {...testIdProps('Disability-Ratings-page')}>
      <ProfileBanner showRating={false} />
      <Box>{getCombinedTotalSection()}</Box>
      <Box mb={condensedMarginBetween}>
        <DefaultList items={individualRatings} title={t('disabilityRatingDetails.individualTitle')} selectable={true} />
      </Box>
      <Box mb={condensedMarginBetween}>{getLearnAboutVaRatingSection()}</Box>
      <Box mb={contentMarginBottom}>{getNeedHelpSection()}</Box>
    </VAScrollView>
  )
}

export default DisabilityRatingsScreen
