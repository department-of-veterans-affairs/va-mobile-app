import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { TFunction } from 'i18next'
import { DateTime } from 'luxon'

import { Box, LinkWithAnalytics, TextView, VAScrollView } from 'components'
import { useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { NAMESPACE } from 'constants/namespaces'
import { TravelPayPartialSuccessStatusConstants } from 'constants/travelPay'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'
import { navigateToTravelPayWebsite } from 'utils/travelPay'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'
import { SetUpDirectDepositWebLink } from './components'

type SubmitSuccessScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'SubmitSuccessScreen'>

type LinkAction = 'navigateToTravelPayWebsite' | 'goBack'
interface SuccessScreenContent {
  title: string
  text: string
  nextText: string
  nextTitle: string
  nextText2: string
  linkText: string
  linkTestID: string
  linkAction: LinkAction
}

const ContentSection = ({
  title,
  text,
  nextText,
  nextTitle,
  nextText2,
  linkText,
  linkTestID,
  onLinkPress,
}: SuccessScreenContent & { onLinkPress: () => void }) => {
  const theme = useTheme()
  return (
    <>
      <TextView testID="successTitleID" variant="BitterHeading" accessibilityRole="header">
        {title}
      </TextView>
      <TextView testID="successTextID" variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
        {text}
      </TextView>
      <TextView testID="successNextTitleID" variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
        {nextTitle}
      </TextView>
      <TextView testID="successNextTextID" variant="MobileBody">
        {nextText}
      </TextView>
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <LinkWithAnalytics type="custom" text={linkText} onPress={onLinkPress} testID={linkTestID} />
      </Box>
      <TextView testID="successNextText2ID" variant="MobileBody" mt={theme.dimensions.condensedMarginBetween}>
        {nextText2}
      </TextView>
    </>
  )
}

const getContent = (
  t: TFunction,
  status: string,
  facilityName: string,
  appointmentDateTime: string,
): SuccessScreenContent => {
  const isPartialSuccess =
    status === TravelPayPartialSuccessStatusConstants.INCOMPLETE ||
    status === TravelPayPartialSuccessStatusConstants.SAVED
  if (isPartialSuccess) {
    return {
      title: t('travelPay.partialSuccess.title'),
      text: t('travelPay.partialSuccess.text'),
      nextText: t('travelPay.partialSuccess.nextText'),
      nextTitle: t('travelPay.success.nextTitle'),
      nextText2: t('travelPay.setUpDirectDeposit.eligible'),
      linkText: t('travelPay.partialSuccess.link'),
      linkTestID: 'finishTravelClaimLinkID',
      linkAction: 'navigateToTravelPayWebsite',
    }
  }

  return {
    title: t('travelPay.success.title'),
    text: t('travelPay.success.text', {
      facilityName,
      date: DateTime.fromISO(appointmentDateTime).toFormat('LLLL dd, yyyy'),
      time: DateTime.fromISO(appointmentDateTime).toFormat('h:mm a'),
    }),
    nextText: t('travelPay.success.nextText'),
    nextTitle: t('travelPay.success.nextTitle'),
    nextText2: t('travelPay.setUpDirectDeposit.eligible'),
    linkText: t('travelPay.success.goToAppointment'),
    linkTestID: 'goToAppointmentLinkID',
    linkAction: 'goBack',
  }
}

function SubmitSuccessScreen({ route, navigation }: SubmitSuccessScreenProps) {
  const { appointmentDateTime, facilityName, status } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const handleClose = () => {
    // This screen lives in a MultiStepSubtask, so we need to get the parent to close the subtask
    navigation.getParent()?.goBack()
  }

  useSubtaskProps({
    rightButtonText: t('close'),
    onRightButtonPress: handleClose,
    rightButtonTestID: 'rightCloseTestID',
  })

  const theme = useTheme()
  const isPortrait = useOrientation()

  const content = getContent(t, status, facilityName, appointmentDateTime)

  const handleLinkPress = () => {
    switch (content.linkAction) {
      case 'navigateToTravelPayWebsite':
        navigateToTravelPayWebsite(t, navigateTo)
        break
      case 'goBack':
      default:
        handleClose()
        break
    }
  }

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <ContentSection {...content} onLinkPress={handleLinkPress} />
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <SetUpDirectDepositWebLink />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default SubmitSuccessScreen
