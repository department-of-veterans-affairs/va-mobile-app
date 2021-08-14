import {
  Box,
  ClickForActionLink,
  ClickToCallPhoneNumber,
  DefaultList,
  DefaultListItemObj,
  LinkButtonProps,
  LinkTypeOptionsConstants,
  LinkUrlIconType,
  LoadingComponent,
  TextArea,
  TextLine,
  TextView,
  VAScrollView,
} from 'components'
import { DateTime } from 'luxon'
import { DisabilityRatingState, StoreState, getDisabilityRating } from 'store'
import { IndividualRatingData, ScreenIDTypesConstants } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { capitalizeFirstLetter } from 'utils/formattingUtils'
import { map } from 'underscore'
import { testIdProps } from 'utils/accessibility'
import { useDispatch, useSelector } from 'react-redux'
import { useTheme, useTranslation } from 'utils/hooks'
import ProfileBanner from './ProfileBanner'
import React, { FC, useEffect } from 'react'
import getEnv from 'utils/env'

const DisabilityRatingsScreen: FC = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)

  const { LINK_URL_ABOUT_DISABILITY_RATINGS } = getEnv()
  const { loading, needsDataLoad, ratingData } = useSelector<StoreState, DisabilityRatingState>((s) => s.disabilityRating)
  const { condensedMarginBetween, contentMarginBottom } = theme.dimensions

  const individualRatingsList: Array<IndividualRatingData> = ratingData?.individualRatings || []
  const totalCombinedRating = ratingData?.combinedDisabilityRating

  useEffect(() => {
    // Get the service history to populate the profile banner
    if (needsDataLoad) {
      dispatch(getDisabilityRating(ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID))
    }
  }, [dispatch, needsDataLoad])

  const individualRatings: Array<DefaultListItemObj> = map(individualRatingsList, (rating: IndividualRatingData) => {
    const { ratingPercentage, decision, effectiveDate, diagnosticText } = rating
    const percentageText = t('disabilityRatingDetails.percentage', { rate: ratingPercentage })
    const formattedDate = DateTime.fromISO(effectiveDate).toUTC().toFormat('MM/dd/yyyy')
    const formattedEffectiveDate = t('disabilityRatingDetails.effectiveDate', { dateEffective: formattedDate })
    const decisionText = t('disabilityRatingDetails.serviceConnected', { yesOrNo: decision === 'Service Connected' ? 'Yes' : 'No' })

    const textLines: Array<TextLine> = [
      {
        text: percentageText,
        variant: 'MobileBodyBold',
      },
      {
        text: capitalizeFirstLetter(diagnosticText),
      },
      {
        text: decisionText,
      },
      {
        text: formattedEffectiveDate,
      },
    ]
    return {
      textLines,
      testId: ` ${percentageText} ${diagnosticText} ${decisionText} ${formattedEffectiveDate}`,
    }
  })

  const getCombinedTotalTextList = (): Array<DefaultListItemObj> => {
    const combinedPrecentText = t('disabilityRatingDetails.percentage', { rate: totalCombinedRating })
    const combinedTotatalSummaryText = t('disabilityRatingDetails.combinedTotalSummary')

    return [
      {
        textLines: totalCombinedRating !== undefined ? [{ text: combinedPrecentText, variant: 'MobileBodyBold' }, { text: combinedTotatalSummaryText }] : [],
        testId: `${combinedPrecentText} ${combinedTotatalSummaryText}`,
      },
    ]
  }

  const getLearnAboutVaRatingSection = () => {
    return (
      <TextArea>
        <Box accessible={true}>
          <TextView variant="MobileBodyBold" accessibilityRole="header" selectable={false} accessibilityLabel={t('disabilityRating.learnAbout.A11yLabel')}>
            {t('disabilityRating.learnAbout')}
          </TextView>
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
        <Box accessible={true}>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('claims:claimDetails.needHelp')}
          </TextView>
          <TextView variant="MobileBody" selectable={false} accessibilityLabel={t('claims:claimDetails.callVA.a11yLabel')}>
            {t('claims:claimDetails.callVA')}
          </TextView>
        </Box>
        <ClickToCallPhoneNumber phone={t('directDeposit.bankFraudHelpNumberDisplayed')} />
      </TextArea>
    )
  }

  if (loading) {
    return (
      <React.Fragment>
        <ProfileBanner showRating={false} />
        <LoadingComponent />
      </React.Fragment>
    )
  }

  const clickToCallProps: LinkButtonProps = {
    displayedText: t('disabilityRating.learnAboutLinkTitle'),
    linkType: LinkTypeOptionsConstants.url,
    linkUrlIconType: LinkUrlIconType.Arrow,
    numberOrUrlLink: LINK_URL_ABOUT_DISABILITY_RATINGS,
    accessibilityHint: t('disabilityRating.learnAboutLinkTitle.a11yHint'),
    accessibilityLabel: t('disabilityRating.learnAboutLinkTitle.a11yLabel'),
  }

  return (
    <VAScrollView {...testIdProps('Disability-Ratings-page')}>
      <ProfileBanner showRating={false} />
      <Box>
        <DefaultList items={getCombinedTotalTextList()} title={t('disabilityRatingDetails.combinedTotalTitle')} />
      </Box>
      <Box mb={condensedMarginBetween}>
        <DefaultList items={individualRatings} title={t('disabilityRatingDetails.individualTitle')} />
      </Box>
      <Box mb={condensedMarginBetween}>{getLearnAboutVaRatingSection()}</Box>
      <Box mb={contentMarginBottom}>{getNeedHelpSection()}</Box>
    </VAScrollView>
  )
}

export default DisabilityRatingsScreen
