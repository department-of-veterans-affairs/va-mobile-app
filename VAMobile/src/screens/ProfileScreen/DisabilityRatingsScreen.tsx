import {
  Box,
  ButtonTypesConstants,
  CallHelpCenter,
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
  TextViewProps,
  VAButton,
  VAScrollView,
} from 'components'
import { DateTime } from 'luxon'
import { DisabilityRatingState, StoreState, getDisabilityRating } from 'store'
import { IndividualRatingData } from 'store/api'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types'
import { capitalizeFirstLetter } from 'utils/formattingUtils'
import { map } from 'underscore'
import { testIdProps } from 'utils/accessibility'
import { useDispatch, useSelector } from 'react-redux'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import ProfileBanner from './ProfileBanner'
import React, { FC, useEffect } from 'react'
import getEnv from 'utils/env'

const DisabilityRatingsScreen: FC = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)
  const navigateTo = useRouteNavigation()

  const { LINK_URL_ABOUT_DISABILITY_RATINGS } = getEnv()
  const { loading, needsDataLoad, ratingData } = useSelector<StoreState, DisabilityRatingState>((s) => s.disabilityRating)
  const { condensedMarginBetween, contentMarginBottom, gutter, standardMarginBetween } = theme.dimensions

  const individualRatingsList: Array<IndividualRatingData> = ratingData?.individualRatings || []
  const totalCombinedRating = ratingData?.combinedDisabilityRating

  useEffect(() => {
    // Get the service history to populate the profile banner
    if (needsDataLoad) {
      dispatch(getDisabilityRating(ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID))
    }
  }, [dispatch, needsDataLoad])

  const onClaimsAndAppeals = navigateTo('Claims')

  const individualRatings: Array<DefaultListItemObj> = map(individualRatingsList, (rating: IndividualRatingData) => {
    const { ratingPercentage, decision, effectiveDate, diagnosticText } = rating

    const decisionText = t('disabilityRatingDetails.serviceConnected', { yesOrNo: decision === 'Service Connected' ? 'Yes' : 'No' })
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
    const combinedPercentText = totalCombinedRating !== undefined ? t('disabilityRatingDetails.percentage', { rate: totalCombinedRating }) : undefined
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
          <Box mx={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween} mb={condensedMarginBetween}>
            <VAButton
              onPress={onClaimsAndAppeals}
              label={t('disabilityRatingDetails.checkClaimsAndAppeal')}
              buttonType={ButtonTypesConstants.buttonPrimary}
              a11yHint={t('disabilityRatingDetails.checkClaimsAndAppealA11yHint')}
            />
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

        <ClickToCallPhoneNumber phone={t('directDeposit.bankFraudHelpNumberDisplayed')} />
      </TextArea>
    )
  }

  if (useError(ScreenIDTypesConstants.DISABILITY_RATING_SCREEN_ID)) {
    return <CallHelpCenter titleText={t('disabilityRating.errorTitle')} titleA11yHint={t('disabilityRating.errorTitleA11y')} callPhone={t('disabilityRating.errorPhoneNumber')} />
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
        <DefaultList items={individualRatings} title={t('disabilityRatingDetails.individualTitle')} />
      </Box>
      <Box mb={condensedMarginBetween}>{getLearnAboutVaRatingSection()}</Box>
      <Box mb={contentMarginBottom}>{getNeedHelpSection()}</Box>
    </VAScrollView>
  )
}

export default DisabilityRatingsScreen
