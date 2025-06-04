import React from 'react'
import { useTranslation } from 'react-i18next'

import { useFocusEffect, useNavigation } from '@react-navigation/native'

import { DateTime } from 'luxon'
import { map } from 'underscore'

import { useDisabilityRating } from 'api/disabilityRating'
import { IndividualRatingData } from 'api/types'
import {
  Box,
  ChildTemplate,
  ClickToCallPhoneNumber,
  ErrorComponent,
  LinkWithAnalytics,
  LoadingComponent,
  TextArea,
  TextView,
  TextViewProps,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import getEnv from 'utils/env'
import { capitalizeFirstLetter, displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useDowntime, useTheme } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'
import { screenContentAllowed } from 'utils/waygateConfig'

import NoDisabilityRatings from './NoDisabilityRatings/NoDisabilityRatings'

function DisabilityRatingsScreen() {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigation = useNavigation()
  const registerReviewEvent = useReviewEvent(true)

  const { LINK_URL_ABOUT_DISABILITY_RATINGS } = getEnv()
  const { condensedMarginBetween, contentMarginBottom, gutter } = theme.dimensions

  const drNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.disabilityRating)
  const {
    data: ratingData,
    isFetching: loading,
    error: useDisabilityRatingError,
    refetch: refetchDisabilityRating,
  } = useDisabilityRating({
    enabled: screenContentAllowed('WG_DisabilityRatings'),
  })

  const titleProps: TextViewProps = {
    variant: 'TableHeaderBold',
    mx: gutter,
    mb: condensedMarginBetween,
    accessibilityRole: 'header',
  }

  useFocusEffect(
    React.useCallback(() => {
      registerReviewEvent()
    }, [registerReviewEvent]),
  )

  const individualRatingsList: Array<IndividualRatingData> = ratingData?.individualRatings || []
  const totalCombinedRating = ratingData?.combinedDisabilityRating

  const individualRatingsHeading = () => {
    return (
      <Box mt={theme.dimensions.standardMarginBetween} accessible={true} accessibilityRole={'header'}>
        <TextView {...titleProps} selectable={false}>
          {t('disabilityRatingDetails.individualTitle')}
        </TextView>
      </Box>
    )
  }

  const individualRatings: React.ReactNode = map(individualRatingsList, (rating: IndividualRatingData) => {
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

    return (
      <Box
        borderTopWidth={theme.dimensions.borderWidth}
        backgroundColor={'list'}
        borderStyle="solid"
        borderColor="primary"
        accessible={true}
        accessibilityRole={'text'}>
        <Box mx={theme.dimensions.gutter} my={theme.dimensions.buttonPadding} flexDirection="column" accessible={false}>
          {percentageText && (
            <TextView variant={'MobileBodyBold'} testID={percentageText} accessible={false}>
              {percentageText}
            </TextView>
          )}
          <TextView accessible={false} testID={diagnosticText}>
            {capitalizeFirstLetter(diagnosticText)}
          </TextView>
          <TextView accessible={false} testID={decisionText}>
            {decisionText}
          </TextView>
          {formattedEffectiveDateText && (
            <TextView accessible={false} testID={formattedEffectiveDateText}>
              {formattedEffectiveDateText}
            </TextView>
          )}
        </Box>
      </Box>
    )
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
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
          <TextView
            variant="MobileBodyBold"
            accessibilityRole="header"
            selectable={false}
            accessibilityLabel={a11yLabelVA(t('disabilityRating.learnAbout'))}>
            {t('disabilityRating.learnAbout')}
          </TextView>
        </Box>
        <Box accessible={true}>
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
          <TextView
            variant="MobileBody"
            accessibilityRole="text"
            selectable={false}
            accessibilityLabel={a11yLabelVA(t('disabilityRating.learnAboutSummary'))}
            paragraphSpacing={true}>
            {t('disabilityRating.learnAboutSummary')}
          </TextView>
        </Box>
        <LinkWithAnalytics
          type="url"
          url={LINK_URL_ABOUT_DISABILITY_RATINGS}
          text={t('disabilityRating.learnAboutLinkTitle')}
          a11yLabel={a11yLabelVA(t('disabilityRating.learnAboutLinkTitle'))}
          a11yHint={t('disabilityRating.learnAboutLinkTitle.a11yHint')}
          testID="aboutDisabilityRatingsTestID"
        />
      </TextArea>
    )
  }

  const getNeedHelpSection = () => {
    return (
      <TextArea testID="needHelpIDSection">
        <Box accessible={true} accessibilityRole={'header'}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('disabilityRatingDetails.needHelp')}
          </TextView>
        </Box>
        <Box accessible={true}>
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
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

  return (
    <ChildTemplate
      backLabel={t('benefits.title')}
      backLabelOnPress={navigation.goBack}
      title={t('disabilityRatingDetails.title')}
      testID="disabilityRatingTestID">
      {loading ? (
        <LoadingComponent text={t('disabilityRating.loading')} />
      ) : useDisabilityRatingError || !drNotInDowntime ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID}
          error={useDisabilityRatingError}
          onTryAgain={refetchDisabilityRating}
        />
      ) : individualRatingsList.length === 0 ? (
        <NoDisabilityRatings />
      ) : (
        <>
          <Box>{getCombinedTotalSection()}</Box>
          <Box mb={condensedMarginBetween}>
            {individualRatingsHeading()}
            {individualRatings}
          </Box>
          <Box mb={condensedMarginBetween}>{getLearnAboutVaRatingSection()}</Box>
          <Box mb={contentMarginBottom}>{getNeedHelpSection()}</Box>
        </>
      )}
    </ChildTemplate>
  )
}

export default DisabilityRatingsScreen
